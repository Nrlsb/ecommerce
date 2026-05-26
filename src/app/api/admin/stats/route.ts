import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Obtener ventas por marca (Joins)
    // Nota: Dado que pedido_items no tiene 'marca', unimos con 'productos'
    const { data: salesByBrandData, error: salesError } = await supabase
      .from('pedido_items')
      .select(`
        cantidad,
        precio_unitario,
        productos:producto_id (marca)
      `);

    if (salesError) throw salesError;

    const brandStats: Record<string, number> = {};
    salesByBrandData?.forEach((item: any) => {
      const marca = item.productos?.marca || 'Sin Marca';
      const totalVenta = item.cantidad * item.precio_unitario;
      brandStats[marca] = (brandStats[marca] || 0) + totalVenta;
    });

    const salesByBrand = Object.entries(brandStats).map(([name, value]) => ({ 
      name, 
      value 
    })).sort((a, b) => b.value - a.value).slice(0, 5);

    // 2. Productos con stock bajo
    const { data: lowStock, error: stockError } = await supabase
      .from('productos')
      .select('nombre, stock, marca')
      .lt('stock', 10)
      .order('stock', { ascending: true })
      .limit(5);

    if (stockError) throw stockError;

    // 3. Búsquedas populares
    const { data: topSearches, error: searchError } = await supabase
      .from('busquedas_stats')
      .select('query, conteo')
      .order('conteo', { ascending: false })
      .limit(5);

    if (searchError && searchError.code !== 'PGRST116') {
        console.error('Search error:', searchError);
    }

    // 4. Totales generales de tablas
    const [
      { count: totalProducts },
      { count: totalOrders },
      { count: totalUsers }
    ] = await Promise.all([
      supabase.from('productos').select('*', { count: 'exact', head: true }),
      supabase.from('pedidos').select('*', { count: 'exact', head: true }),
      supabase.from('usuarios').select('*', { count: 'exact', head: true }),
    ]);

    // 5. Ventas y Facturación (Pedidos pagados o enviados)
    const { data: ordersData, error: ordersDataError } = await supabase
      .from('pedidos')
      .select('total, estado, created_at')
      .in('estado', ['pagado', 'enviado']);

    if (ordersDataError) throw ordersDataError;

    let totalRevenue = 0;
    const monthlySalesMap: Record<string, number> = {};

    // Ordenar cronológicamente
    const sortedOrders = (ordersData || []).sort(
      (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    sortedOrders.forEach((order: any) => {
      const orderTotal = Number(order.total) || 0;
      totalRevenue += orderTotal;

      // Agrupar por mes
      const date = new Date(order.created_at);
      const monthYear = date.toLocaleString('es-AR', { month: 'short', year: 'numeric' });
      monthlySalesMap[monthYear] = (monthlySalesMap[monthYear] || 0) + orderTotal;
    });

    const paidOrdersCount = ordersData?.length || 0;
    const averageOrderValue = paidOrdersCount > 0 ? (totalRevenue / paidOrdersCount) : 0;

    const salesEvolution = Object.entries(monthlySalesMap).map(([month, amount]) => ({
      month,
      amount
    }));

    // 6. Productos sin imagen
    const { data: allProducts, error: productsError } = await supabase
      .from('productos')
      .select('id, nombre, marca, codigo_externo, imagen_url');

    if (productsError) throw productsError;

    const noImageProducts = (allProducts || []).filter(
      (p: any) => !p.imagen_url || p.imagen_url.trim() === ''
    );

    return NextResponse.json({
      stats: {
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalUsers: totalUsers || 0,
        totalRevenue,
        averageOrderValue,
        paidOrdersCount
      },
      salesByBrand,
      lowStock: lowStock || [],
      topSearches: topSearches || [],
      noImageProducts: noImageProducts || [],
      salesEvolution
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
