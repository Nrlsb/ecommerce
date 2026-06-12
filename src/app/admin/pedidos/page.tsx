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
    AlertCircle, RefreshCcw, FileJson,
    X, Copy, Check
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
    nro_pedido?: number;
    cliente_nombre: string;
    cliente_email: string;
    total: number;
    estado: string;
    payment_id: string | null;
    created_at: string;
    items: OrderItem[];
    metodo_pago?: string;
    metodo_entrega?: string;
    envio_costo?: number;
    envio_direccion?: string;
    envio_ciudad?: string;
    envio_codigo_postal?: string;
    envio_provincia?: string;
    envio_telefono?: string;
    envio_notas?: string;
    facturacion_tipo?: string;
    facturacion_nombre?: string;
    facturacion_documento?: string;
    payway_tid?: string;
    payway_auth_code?: string;
}

export default function OrderManagement() {
    const { user: currentUser, profile: currentProfile, loading: authLoading } = useAuth();
    const router = useRouter();

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    // Estados para visor de logs de Payway
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [showLogModal, setShowLogModal] = useState<boolean>(false);
    const [activeLogTab, setActiveLogTab] = useState<'raw' | 'checkout' | 'webhooks' | 'refunds'>('raw');
    const [copiedLog, setCopiedLog] = useState<boolean>(false);

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
            const order = orders.find(o => o.id === orderId);
            const isPayway = order?.metodo_pago === 'payway';
            const confirmMsg = order?.payment_id 
                ? `¿Estás seguro de que deseas anular este pedido? Se procesará un REEMBOLSO automático en ${isPayway ? 'Payway' : 'Mercado Pago'}.` 
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

    const handleFetchPaywayLog = async (orderId: string) => {
        setIsActionLoading(orderId);
        try {
            const res = await fetch(`/api/admin/orders/payway-log?id=${orderId}`);
            const data = await res.json();
            if (res.ok) {
                setSelectedLog(data);
                setActiveLogTab('raw');
                setShowLogModal(true);
            } else {
                alert(data.error || 'No se pudo obtener el registro de la operación.');
            }
        } catch (err: any) {
            console.error('Error fetching payway log:', err);
            alert('Error al conectar con el servidor.');
        } finally {
            setIsActionLoading(null);
        }
    };

    const handlePaywayRefund = async (orderId: string, paymentId: string | null, total: number) => {
        if (!paymentId) {
            alert('No se puede reembolsar: Falta el ID de pago de Payway.');
            return;
        }
        if (!window.confirm(`¿Estás seguro de que deseas reembolsar este pedido en Payway por el total de $${Number(total).toLocaleString('es-AR')}?`)) {
            return;
        }

        setIsActionLoading(orderId);
        try {
            const res = await fetch('/api/admin/payway/refund', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    payment_id: paymentId,
                    amount: total * 100, // En centavos para Payway
                    pedido_id: orderId
                })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({ 
                    message: 'Reembolso en Payway procesado exitosamente.', 
                    type: 'success' 
                });
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, estado: 'reembolsado' } : o));
            } else {
                throw new Error(data.error || 'Error procesando reembolso');
            }
        } catch (err: any) {
            setStatus({ message: err.message, type: 'error' });
        } finally {
            setIsActionLoading(null);
            setTimeout(() => setStatus({ message: '', type: '' }), 4000);
        }
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedLog(true);
        setTimeout(() => setCopiedLog(false), 2000);
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
                                                        <p className="text-xs font-mono font-bold text-foreground" title={order.id}>
                                                            #{order.nro_pedido || order.id.split('-')[0]}
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
                                                    <span className="block text-[8px] text-green-500/60 font-bold mt-1 uppercase">
                                                        {order.metodo_pago === 'payway' ? 'PW' : 'MP'} ID: {order.payment_id}
                                                    </span>
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
                                                                            <img src={item.producto.imagen_url} alt={item.producto.nombre} className="w-full h-full object-contain p-1" />
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

                                                        {/* Información adicional de envío y pago */}
                                                        <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            {/* Shipping Details */}
                                                            <div>
                                                                <h4 className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-3">Detalles de Entrega</h4>
                                                                <div className="bg-card border border-border p-4 rounded-xl space-y-2 text-xs">
                                                                    <p className="text-foreground"><span className="font-bold text-foreground/60">Método:</span> <span className="uppercase font-mono">{order.metodo_entrega || 'No especificado'}</span></p>
                                                                    {order.metodo_entrega === 'envio' ? (
                                                                        <>
                                                                            <p className="text-foreground"><span className="font-bold text-foreground/60">Dirección:</span> {order.envio_direccion}</p>
                                                                            <p className="text-foreground"><span className="font-bold text-foreground/60">Ciudad/Provincia:</span> {order.envio_ciudad}, {order.envio_provincia} (CP: {order.envio_codigo_postal})</p>
                                                                            {order.envio_telefono && <p className="text-foreground"><span className="font-bold text-foreground/60">Teléfono:</span> {order.envio_telefono}</p>}
                                                                            {order.envio_notas && <p className="text-foreground italic"><span className="font-bold text-foreground/60 not-italic">Notas:</span> "{order.envio_notas}"</p>}
                                                                            <p className="text-foreground"><span className="font-bold text-foreground/60">Costo de envío:</span> ${Number(order.envio_costo || 0).toLocaleString('es-AR')}</p>
                                                                        </>
                                                                    ) : (
                                                                        <p className="text-foreground/60 italic">Retira en sucursal.</p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Payment / Invoice Details */}
                                                            <div>
                                                                <h4 className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-3">Detalles de Facturación y Pago</h4>
                                                                <div className="bg-card border border-border p-4 rounded-xl space-y-2 text-xs">
                                                                    <p className="text-foreground"><span className="font-bold text-foreground/60">Medio de Pago:</span> <span className="uppercase font-bold text-primary">{order.metodo_pago || 'Mercado Pago'}</span></p>
                                                                    <p className="text-foreground"><span className="font-bold text-foreground/60">Factura:</span> {order.facturacion_tipo || 'Consumidor Final'}</p>
                                                                    {order.facturacion_nombre && <p className="text-foreground"><span className="font-bold text-foreground/60">Razón Social:</span> {order.facturacion_nombre}</p>}
                                                                    {order.facturacion_documento && <p className="text-foreground"><span className="font-bold text-foreground/60">Documento / CUIT:</span> {order.facturacion_documento}</p>}
                                                                    
                                                                    {order.metodo_pago === 'payway' && (
                                                                        <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
                                                                            <button
                                                                                onClick={() => handleFetchPaywayLog(order.id)}
                                                                                disabled={isActionLoading === order.id}
                                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider rounded-lg transition-all disabled:opacity-50"
                                                                            >
                                                                                {isActionLoading === order.id ? (
                                                                                    <Loader2 size={12} className="animate-spin" />
                                                                                ) : (
                                                                                    <FileJson size={12} />
                                                                                )}
                                                                                Ver JSON Payway
                                                                            </button>
                                                                            
                                                                            {order.estado === 'pagado' && (
                                                                                <button
                                                                                    onClick={() => handlePaywayRefund(order.id, order.payment_id, order.total)}
                                                                                    disabled={isActionLoading === order.id}
                                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all disabled:opacity-50"
                                                                                >
                                                                                    <RefreshCcw size={12} className={isActionLoading === order.id ? "animate-spin" : ""} />
                                                                                    Reembolsar Payway
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
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

            {/* Modal para ver logs de Payway */}
            <AnimatePresence>
                {showLogModal && selectedLog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
                            onClick={() => { setShowLogModal(false); setSelectedLog(null); }}
                        />
                        
                        {/* Modal Content */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="relative bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden z-10"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
                                <div className="flex items-center gap-2">
                                    <FileJson className="text-primary" size={20} />
                                    <h3 className="font-black text-sm text-foreground uppercase tracking-wider">Registro de Transacción Payway</h3>
                                </div>
                                <button 
                                    onClick={() => { setShowLogModal(false); setSelectedLog(null); }}
                                    className="p-1.5 hover:bg-muted rounded-lg text-foreground/40 hover:text-foreground transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-border bg-muted/40 px-6 py-2 gap-2 overflow-x-auto">
                                <button
                                    onClick={() => setActiveLogTab('raw')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                        activeLogTab === 'raw' 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'hover:bg-muted text-foreground/60'
                                    }`}
                                >
                                    Completo
                                </button>
                                {selectedLog.checkout && (
                                    <button
                                        onClick={() => setActiveLogTab('checkout')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                            activeLogTab === 'checkout' 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'hover:bg-muted text-foreground/60'
                                        }`}
                                    >
                                        Checkout (Request/Response)
                                    </button>
                                )}
                                {selectedLog.webhooks && selectedLog.webhooks.length > 0 && (
                                    <button
                                        onClick={() => setActiveLogTab('webhooks')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                            activeLogTab === 'webhooks' 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'hover:bg-muted text-foreground/60'
                                        }`}
                                    >
                                        Webhooks ({selectedLog.webhooks.length})
                                    </button>
                                )}
                                {selectedLog.refunds && selectedLog.refunds.length > 0 && (
                                    <button
                                        onClick={() => setActiveLogTab('refunds')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                            activeLogTab === 'refunds' 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'hover:bg-muted text-foreground/60'
                                        }`}
                                    >
                                        Reembolsos ({selectedLog.refunds.length})
                                    </button>
                                )}
                            </div>

                            {/* Content Body */}
                            <div className="p-6 overflow-y-auto flex-1 bg-muted/10 flex flex-col min-h-0">
                                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                    <span className="text-[10px] font-mono text-foreground/40 font-bold uppercase tracking-wider">
                                        ID Pedido: {selectedLog.order_id}
                                    </span>
                                    <button
                                        onClick={() => handleCopyToClipboard(
                                            JSON.stringify(
                                                activeLogTab === 'raw' ? selectedLog :
                                                activeLogTab === 'checkout' ? selectedLog.checkout :
                                                activeLogTab === 'webhooks' ? selectedLog.webhooks :
                                                selectedLog.refunds, 
                                                null, 
                                                2
                                            )
                                        )}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border hover:bg-muted text-[10px] font-black uppercase tracking-wider rounded-lg transition-all text-foreground/60 hover:text-foreground"
                                    >
                                        {copiedLog ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                        {copiedLog ? 'Copiado' : 'Copiar JSON'}
                                    </button>
                                </div>

                                <div className="rounded-xl overflow-hidden border border-zinc-800 shadow-inner flex-1 flex flex-col min-h-0">
                                    <pre className="bg-zinc-950 text-emerald-400 p-5 overflow-auto text-xs font-mono select-text leading-relaxed flex-1">
                                        {activeLogTab === 'raw' && JSON.stringify(selectedLog, null, 2)}
                                        {activeLogTab === 'checkout' && JSON.stringify(selectedLog.checkout, null, 2)}
                                        {activeLogTab === 'webhooks' && JSON.stringify(selectedLog.webhooks, null, 2)}
                                        {activeLogTab === 'refunds' && JSON.stringify(selectedLog.refunds, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Para usar React.Fragment en una página 'use client' sin importar React completo si no es necesario por Next
import React from 'react';
