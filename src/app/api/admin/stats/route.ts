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

    // 4. Totales generales
    const [
      { count: totalProducts },
      { count: totalOrders },
      { count: totalUsers }
    ] = await Promise.all([
      supabase.from('productos').select('*', { count: 'exact', head: true }),
      supabase.from('pedidos').select('*', { count: 'exact', head: true }),
      supabase.from('usuarios').select('*', { count: 'exact', head: true }),
    ]);

    return NextResponse.json({
      stats: {
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalUsers: totalUsers || 0,
      },
      salesByBrand,
      lowStock: lowStock || [],
      topSearches: topSearches || []
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
