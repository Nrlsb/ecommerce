'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingBag, ArrowLeft, Loader2, 
    Mail, Calendar, User, 
    DollarSign, CheckCircle2, XCircle, 
    Clock, ChevronDown, ChevronUp, 
    AlertCircle, RefreshCcw
} from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
    id: number;
    pedido_id: string;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    producto: {
        nombre: string;
        marca: string;
        imagen_url: string;
    };
}

interface Order {
    id: string;
    cliente_nombre: string;
    cliente_email: string;
    total: number;
    estado: string;
    payment_id: string | null;
    created_at: string;
    items: OrderItem[];
}

export default function OrderManagement() {
    const { user: currentUser, profile: currentProfile, loading: authLoading } = useAuth();
    const router = useRouter();

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            if (res.ok) {
                setOrders(data);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && (!currentUser || (currentProfile?.rol !== 'admin' && currentProfile?.rol !== 'vendedor'))) {
            router.push('/admin');
            return;
        }
        fetchOrders();
    }, [currentUser, currentProfile, authLoading, router]);

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        if (newStatus === 'anulado') {
            const confirmMsg = orders.find(o => o.id === orderId)?.payment_id 
                ? '¿Estás seguro de que deseas anular este pedido? Se procesará un REEMBOLSO automático en Mercado Pago.' 
                : '¿Estás seguro de que deseas anular este pedido?';
            if (!window.confirm(confirmMsg)) return;
        }

        setIsActionLoading(orderId);
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, estado: newStatus })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({ 
                    message: data.refunded ? 'Pedido anulado y reembolso procesado.' : 'Estado actualizado con éxito.', 
                    type: 'success' 
                });
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, estado: newStatus } : o));
            } else {
                const errorMsg = data.details 
                    ? `${data.error}: ${data.details}` 
                    : (data.error || 'Error al actualizar pedido');
                throw new Error(errorMsg);
            }
        } catch (err: any) {
            setStatus({ message: err.message, type: 'error' });
        } finally {
            setIsActionLoading(null);
            setTimeout(() => setStatus({ message: '', type: '' }), 4000);
        }
    };

    const getStatusStyles = (estado: string) => {
        switch (estado) {
            case 'pagado':
                return 'bg-green-500/10 border-green-500/20 text-green-600';
            case 'enviado':
                return 'bg-blue-500/10 border-blue-500/20 text-blue-600';
            case 'anulado':
                return 'bg-red-500/10 border-red-500/20 text-red-600';
            case 'pendiente':
                return 'bg-orange-500/10 border-orange-500/20 text-orange-600';
            default:
                return 'bg-muted border-border text-foreground/60';
        }
    };

    const getStatusIcon = (estado: string) => {
        switch (estado) {
            case 'pagado': return <CheckCircle2 size={14} />;
            case 'anulado': return <XCircle size={14} />;
            case 'pendiente': return <Clock size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-foreground/60 font-medium">Cargando pedidos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link href="/admin" className="inline-flex items-center text-sm text-foreground/60 hover:text-primary mb-2 transition-colors">
                            <ArrowLeft size={16} className="mr-1" /> Volver al panel
                        </Link>
                        <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                            <ShoppingBag className="text-primary" size={32} />
                            Gestión de Pedidos
                        </h1>
                        <p className="text-foreground/60">Visualiza y administra las ventas y reembolsos del sistema.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={fetchOrders}
                            className="p-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors text-foreground/60"
                            title="Recargar"
                        >
                            <RefreshCcw size={20} />
                        </button>

                        <AnimatePresence>
                            {status.message && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className={`px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 ${
                                        status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-red-500/10 border-red-500/20 text-red-600'
                                    }`}
                                >
                                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    <span className="text-sm font-bold">{status.message}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">ID Pedido / Fecha</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Cliente</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Total</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Estado</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {orders.map((order) => (
                                    <React.Fragment key={order.id}>
                                        <tr className={`hover:bg-muted/20 transition-colors ${expandedOrder === order.id ? 'bg-muted/10' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                                        className="p-1 hover:bg-muted rounded-lg transition-colors text-foreground/40"
                                                    >
                                                        {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </button>
                                                    <div>
                                                        <p className="text-xs font-mono font-bold text-foreground/40 truncate w-24" title={order.id}>
                                                            {order.id.split('-')[0]}...
                                                        </p>
                                                        <p className="text-xs text-foreground/60 flex items-center gap-1 mt-1">
                                                            <Calendar size={12} /> {new Date(order.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-foreground">{order.cliente_nombre}</p>
                                                        <p className="text-[10px] text-foreground/40 flex items-center gap-1">
                                                            <Mail size={10} /> {order.cliente_email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-black text-foreground flex items-center gap-0.5">
                                                    <DollarSign size={14} className="text-foreground/40" />
                                                    {Number(order.total).toLocaleString('es-AR')}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${getStatusStyles(order.estado)}`}>
                                                    {getStatusIcon(order.estado)}
                                                    {order.estado}
                                                </div>
                                                {order.payment_id && order.estado === 'pagado' && (
                                                    <span className="block text-[8px] text-green-500/60 font-bold mt-1 uppercase">MP ID: {order.payment_id}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {order.estado !== 'anulado' && (
                                                        <select
                                                            value={order.estado}
                                                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                            disabled={isActionLoading === order.id}
                                                            className="bg-muted border border-border text-[10px] font-black uppercase rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer disabled:opacity-50"
                                                        >
                                                            <option value="pendiente">Pendiente</option>
                                                            <option value="pagado">Pagado</option>
                                                            <option value="enviado">Enviado</option>
                                                            <option value="anulado">Anular</option>
                                                        </select>
                                                    )}
                                                    {order.estado === 'anulado' && (
                                                        <span className="text-[10px] font-black text-red-500/40 uppercase italic">Pedido Anulado</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Row Expandida para Detalles */}
                                        <AnimatePresence>
                                            {expandedOrder === order.id && (
                                                <motion.tr
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                >
                                                    <td colSpan={5} className="px-10 py-6 bg-muted/5 border-l-4 border-primary/20">
                                                        <h4 className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-4">Productos del Pedido</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {order.items?.map((item) => (
                                                                <div key={item.id} className="bg-card border border-border p-3 rounded-xl flex items-center gap-4">
                                                                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                                        {item.producto?.imagen_url ? (
                                                                            <img src={item.producto.imagen_url} alt={item.producto.nombre} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <ShoppingBag size={20} className="text-foreground/20" />
                                                                        )}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-sm font-bold text-foreground truncate">{item.producto?.nombre || 'Producto desconocido'}</p>
                                                                        <p className="text-[10px] text-foreground/60 truncate">{item.producto?.marca} • {item.cantidad} x ${Number(item.precio_unitario).toLocaleString('es-AR')}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {(!order.items || order.items.length === 0) && (
                                                            <p className="text-sm text-foreground/40 italic">No se encontraron ítems para este pedido.</p>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {orders.length === 0 && !isLoading && (
                    <div className="py-20 text-center text-foreground/40 italic flex flex-col items-center gap-4">
                        <ShoppingBag size={48} className="opacity-10" />
                        No se encontraron pedidos registrados.
                    </div>
                )}
            </div>
        </div>
    );
}

// Para usar React.Fragment en una página 'use client' sin importar React completo si no es necesario por Next
import React from 'react';
