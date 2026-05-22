'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Package, Calendar, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PedidosPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            
            try {
                const { data, error } = await supabase
                    .from('pedidos')
                    .select('*, pedido_items(*, productos(nombre, imagen_url))')
                    .eq('cliente_email', user.email)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            if (user) {
                fetchOrders();
            } else {
                setLoading(false);
            }
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
                <div className="bg-muted p-6 rounded-full mb-6">
                    <ShoppingBag className="w-12 h-12 text-foreground/20" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Debes iniciar sesión</h2>
                <p className="text-foreground/60 mb-8 max-w-sm">Inicia sesión para ver tu historial de compras y seguir tus pedidos.</p>
                <Link href="/login" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                    Iniciar Sesión
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-foreground tracking-tight">Mis Pedidos</h1>
                    <p className="text-foreground/60 mt-2">Gestiona tus compras y sigue el estado de tus envíos.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-sm">
                        <div className="bg-muted p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                            <Package className="w-8 h-8 text-foreground/40" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Aún no tienes pedidos</h3>
                        <p className="text-foreground/60 mb-8">Cuando realices tu primera compra, aparecerá aquí.</p>
                        <Link href="/catalogo" className="inline-flex items-center text-primary font-bold hover:underline">
                            Ir al Catálogo <ChevronRight className="ml-1 w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={order.id} 
                                className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="p-6 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">Fecha</p>
                                            <div className="flex items-center gap-2 text-sm font-bold">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                {new Date(order.created_at).toLocaleDateString('es-AR')}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">Total</p>
                                            <p className="text-sm font-black text-primary">${Number(order.total).toLocaleString('es-AR')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">Estado</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${order.estado === 'pagado' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                                <span className="text-xs font-bold capitalize">{order.estado}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-mono text-foreground/30">ID: {order.id.substring(0, 8)}</p>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.pedido_items?.map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-muted rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-border">
                                                    {item.productos?.imagen_url ? (
                                                        <img src={item.productos.imagen_url} alt={item.productos.nombre} className="w-full h-full object-contain p-1" />
                                                    ) : (
                                                        <Package className="w-6 h-6 text-foreground/20" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-foreground truncate">{item.productos?.nombre || 'Producto'}</p>
                                                    <p className="text-xs text-foreground/50">{item.cantidad} x ${Number(item.precio_unitario).toLocaleString('es-AR')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-6 pt-6 border-t border-border flex justify-end">
                                        <button className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">Ver detalle completo</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
