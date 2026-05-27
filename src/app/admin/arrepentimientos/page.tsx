'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Loader2, Mail, Calendar, User, Phone,
    DollarSign, CheckCircle2, XCircle, Clock, 
    ChevronDown, ChevronUp, AlertCircle, RefreshCcw, 
    Undo2, FileText
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface Solicitud {
    id: string;
    pedido_id: string | null;
    pedido_numero: string;
    nombre: string;
    email: string;
    telefono: string;
    motivo: string | null;
    estado: 'pendiente' | 'procesado' | 'rechazado';
    created_at: string;
    pedido?: {
        id: string;
        cliente_nombre: string;
        cliente_email: string;
        total: number;
        estado: string;
        created_at: string;
        metodo_pago: string;
    } | null;
}

export default function ArrepentimientoManagement() {
    const { user: currentUser, profile: currentProfile, loading: authLoading } = useAuth();
    const router = useRouter();

    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
    const [expandedSolicitud, setExpandedSolicitud] = useState<string | null>(null);

    const fetchSolicitudes = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/arrepentimientos');
            const data = await res.json();
            if (res.ok) {
                setSolicitudes(data);
            }
        } catch (err) {
            console.error('Error fetching solicitudes:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && (!currentUser || (currentProfile?.rol !== 'admin' && currentProfile?.rol !== 'vendedor'))) {
            router.push('/admin');
            return;
        }
        fetchSolicitudes();
    }, [currentUser, currentProfile, authLoading, router]);

    const handleUpdateStatus = async (solicitudId: string, newStatus: string) => {
        setIsActionLoading(solicitudId);
        try {
            const res = await fetch('/api/admin/arrepentimientos', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: solicitudId, estado: newStatus })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({ 
                    message: `Solicitud marcada como ${newStatus} con éxito.`, 
                    type: 'success' 
                });
                setSolicitudes(prev => prev.map(s => s.id === solicitudId ? { ...s, estado: newStatus as any } : s));
            } else {
                throw new Error(data.error || 'Error al actualizar el estado');
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
            case 'procesado':
                return 'bg-green-500/10 border-green-500/20 text-green-600';
            case 'rechazado':
                return 'bg-red-500/10 border-red-500/20 text-red-600';
            case 'pendiente':
                return 'bg-orange-500/10 border-orange-500/20 text-orange-600';
            default:
                return 'bg-muted border-border text-foreground/60';
        }
    };

    const getStatusIcon = (estado: string) => {
        switch (estado) {
            case 'procesado': return <CheckCircle2 size={14} />;
            case 'rechazado': return <XCircle size={14} />;
            case 'pendiente': return <Clock size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    const countStats = {
        total: solicitudes.length,
        pendiente: solicitudes.filter(s => s.estado === 'pendiente').length,
        procesado: solicitudes.filter(s => s.estado === 'procesado').length,
        rechazado: solicitudes.filter(s => s.estado === 'rechazado').length,
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-foreground/60 font-medium">Cargando solicitudes de arrepentimiento...</p>
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
                            <Undo2 className="text-primary" size={32} />
                            Solicitudes de Arrepentimiento
                        </h1>
                        <p className="text-foreground/60">Gestiona las solicitudes de revocación de compra de los clientes de acuerdo a la Ley de Defensa del Consumidor.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={fetchSolicitudes}
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

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                        <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Total Solicitudes</p>
                        <p className="text-2xl font-black text-foreground mt-2">{countStats.total}</p>
                    </div>
                    <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                        <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Pendientes</p>
                        <p className="text-2xl font-black text-orange-600 mt-2">{countStats.pendiente}</p>
                    </div>
                    <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                        <p className="text-xs font-bold text-green-500 uppercase tracking-widest">Procesadas</p>
                        <p className="text-2xl font-black text-green-600 mt-2">{countStats.procesado}</p>
                    </div>
                    <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                        <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Rechazadas</p>
                        <p className="text-2xl font-black text-red-600 mt-2">{countStats.rechazado}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Pedido / Fecha</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Cliente</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Contacto</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Estado</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {solicitudes.map((sol) => (
                                    <React.Fragment key={sol.id}>
                                        <tr className={`hover:bg-muted/20 transition-colors ${expandedSolicitud === sol.id ? 'bg-muted/10' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => setExpandedSolicitud(expandedSolicitud === sol.id ? null : sol.id)}
                                                        className="p-1 hover:bg-muted rounded-lg transition-colors text-foreground/40"
                                                    >
                                                        {expandedSolicitud === sol.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </button>
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">
                                                            #{sol.pedido_numero.length > 15 ? `${sol.pedido_numero.substring(0, 8)}...` : sol.pedido_numero}
                                                        </p>
                                                        <p className="text-xs text-foreground/60 flex items-center gap-1 mt-1">
                                                            <Calendar size={12} /> {new Date(sol.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-primary/5 flex items-center justify-center text-primary/60">
                                                        <User size={14} />
                                                    </div>
                                                    <p className="font-bold text-sm text-foreground">{sol.nombre}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs space-y-0.5">
                                                    <p className="text-foreground/80 flex items-center gap-1">
                                                        <Mail size={12} className="text-foreground/40" /> {sol.email}
                                                    </p>
                                                    <p className="text-foreground/60 flex items-center gap-1">
                                                        <Phone size={12} className="text-foreground/40" /> {sol.telefono}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${getStatusStyles(sol.estado)}`}>
                                                    {getStatusIcon(sol.estado)}
                                                    {sol.estado}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <select
                                                        value={sol.estado}
                                                        onChange={(e) => handleUpdateStatus(sol.id, e.target.value)}
                                                        disabled={isActionLoading === sol.id}
                                                        className="bg-muted border border-border text-[10px] font-black uppercase rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer disabled:opacity-50"
                                                    >
                                                        <option value="pendiente">Pendiente</option>
                                                        <option value="procesado">Procesado</option>
                                                        <option value="rechazado">Rechazado</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Expanded details */}
                                        <AnimatePresence>
                                            {expandedSolicitud === sol.id && (
                                                <motion.tr
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                >
                                                    <td colSpan={5} className="px-10 py-6 bg-muted/5 border-l-4 border-primary/20">
                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                            <div>
                                                                <h4 className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                                    <FileText size={12} /> Motivo Especificado por el Cliente
                                                                </h4>
                                                                <div className="bg-card border border-border p-4 rounded-xl text-sm italic text-foreground/80 whitespace-pre-wrap">
                                                                    {sol.motivo ? `"${sol.motivo}"` : 'El cliente no especificó ningún motivo.'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                                    <AlertCircle size={12} /> Pedido Original Asociado
                                                                </h4>
                                                                {sol.pedido ? (
                                                                    <div className="bg-card border border-border p-4 rounded-xl text-sm space-y-2">
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="font-medium text-foreground/60">ID Interno:</span>
                                                                            <span className="font-mono text-xs">{sol.pedido.id}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="font-medium text-foreground/60">Total original:</span>
                                                                            <span className="font-black text-foreground flex items-center gap-0.5">
                                                                                <DollarSign size={12} />
                                                                                {Number(sol.pedido.total).toLocaleString('es-AR')}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="font-medium text-foreground/60">Medio Pago:</span>
                                                                            <span className="font-bold text-foreground capitalize">{sol.pedido.metodo_pago}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="font-medium text-foreground/60">Estado de Compra:</span>
                                                                            <span className="font-bold uppercase text-xs">{sol.pedido.estado}</span>
                                                                        </div>
                                                                        <div className="pt-2 text-right">
                                                                            <Link 
                                                                                href="/admin/pedidos" 
                                                                                className="text-xs font-bold text-primary hover:underline"
                                                                            >
                                                                                Ir a Gestión de Pedidos →
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="bg-card border border-border p-4 rounded-xl text-xs text-foreground/50 italic flex items-center gap-2">
                                                                        <AlertCircle size={14} className="text-orange-500" />
                                                                        No se encontró un pedido registrado en el sistema que coincida con el ID proporcionado. (Puede que sea un pedido anterior o el cliente ingresó mal el número).
                                                                    </div>
                                                                )}
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

                {solicitudes.length === 0 && !isLoading && (
                    <div className="py-20 text-center text-foreground/40 italic flex flex-col items-center gap-4">
                        <Undo2 size={48} className="opacity-10" />
                        No se registraron solicitudes de arrepentimiento.
                    </div>
                )}
            </div>
        </div>
    );
}
