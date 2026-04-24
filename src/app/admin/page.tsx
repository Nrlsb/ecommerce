'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, Users, ShoppingBag, Settings, ArrowLeft, RefreshCw, Tags, CheckCircle2, AlertCircle, Loader2, FileDown } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    const [syncingProducts, setSyncingProducts] = useState(false);
    const [syncingCategories, setSyncingCategories] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' }); // 'success' | 'error' | 'info'

    const handleSync = async (type: 'products' | 'categories') => {
        const isProducts = type === 'products';
        const setSyncing = isProducts ? setSyncingProducts : setSyncingCategories;
        const endpoint = isProducts ? '/api/sync-products' : '/api/sync-categories';
        const label = isProducts ? 'productos' : 'categorías';

        setSyncing(true);
        setStatus({ message: '', type: '' });

        try {
            const res = await fetch(endpoint);
            const data = await res.json();

            if (res.ok) {
                setStatus({
                    message: `Sincronización de ${label} completada: ${data.processed || 0} procesados.`,
                    type: 'success'
                });
            } else {
                throw new Error(data.error || `Error al sincronizar ${label}`);
            }
        } catch (err) {
            setStatus({
                message: `Error: ${err instanceof Error ? err.message : String(err)}`,
                type: 'error'
            });
        } finally {
            setSyncing(false);
            // Limpiar mensaje después de 5 segundos
            setTimeout(() => setStatus({ message: '', type: '' }), 5000);
        }
    };

    const handleExport = async () => {
        setExporting(true);
        setStatus({ message: 'Generando archivo Excel...', type: 'info' });

        try {
            const res = await fetch('/api/admin/export-products');

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error al generar el Excel');
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `productos_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setStatus({ message: 'Excel descargado con éxito', type: 'success' });
        } catch (err) {
            setStatus({
                message: `Error: ${err instanceof Error ? err.message : String(err)}`,
                type: 'error'
            });
        } finally {
            setExporting(false);
            setTimeout(() => setStatus({ message: '', type: '' }), 5000);
        }
    };

    useEffect(() => {
        if (!loading && (!user || profile?.rol !== 'admin')) {
            router.push('/');
        }
    }, [user, profile, loading, router]);

    if (loading || !profile || profile.rol !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const stats = [
        { label: 'Productos', value: '124', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Clientes', value: '850', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Pedidos', value: '45', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <Link href="/" className="inline-flex items-center text-sm text-foreground/60 hover:text-primary mb-2 transition-colors">
                            <ArrowLeft size={16} className="mr-1" /> Volver a la tienda
                        </Link>
                        <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                            <LayoutDashboard className="text-primary" size={32} />
                            Panel de Control
                        </h1>
                        <p className="text-foreground/60">Gestiona productos, pedidos y clientes desde aquí.</p>
                    </div>

                    <AnimatePresence>
                        {status.message && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${status.type === 'success'
                                    ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                                    }`}
                            >
                                {status.type === 'success' ? <CheckCircle2 size={18} /> : status.type === 'error' ? <AlertCircle size={18} /> : <Loader2 className="animate-spin" size={18} />}
                                <span className="text-sm font-medium">{status.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5"
                        >
                            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground/60">{stat.label}</p>
                                <p className="text-3xl font-black text-foreground">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Package size={22} className="text-primary" />
                            Gestión de Inventario
                        </h2>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                <p className="font-bold group-hover:text-primary transition-colors">Agregar nuevo producto</p>
                                <p className="text-sm text-foreground/60 line-clamp-1">Sube imágenes, descripción y establece precios.</p>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                <p className="font-bold group-hover:text-primary transition-colors">Ver lista de productos</p>
                                <p className="text-sm text-foreground/60 line-clamp-1">Edita stock, precios y destacados.</p>
                            </button>

                            <button
                                onClick={handleExport}
                                disabled={exporting}
                                className="w-full text-left p-4 rounded-xl border border-green-500/20 bg-green-500/5 hover:border-green-500/50 hover:bg-green-500/10 transition-all group disabled:opacity-50"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-green-700 dark:text-green-400 group-hover:text-green-600 transition-colors">Descargar Inventario (Excel)</p>
                                        <p className="text-sm text-foreground/60 line-clamp-1">Obtén un reporte completo de todos los productos.</p>
                                    </div>
                                    {exporting ? (
                                        <Loader2 className="animate-spin text-green-500" size={20} />
                                    ) : (
                                        <FileDown className="text-green-500 group-hover:translate-y-0.5 transition-transform" size={20} />
                                    )}
                                </div>
                            </button>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <button
                                    onClick={() => handleSync('products')}
                                    disabled={syncingProducts}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {syncingProducts ? (
                                        <Loader2 className="animate-spin text-blue-500 mb-2" size={20} />
                                    ) : (
                                        <RefreshCw className="text-blue-500 mb-2 group-hover:rotate-180 transition-transform duration-500" size={20} />
                                    )}
                                    <p className="text-xs font-bold text-center">Sincronizar Productos</p>
                                </button>

                                <button
                                    onClick={() => handleSync('categories')}
                                    disabled={syncingCategories}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {syncingCategories ? (
                                        <Loader2 className="animate-spin text-purple-500 mb-2" size={20} />
                                    ) : (
                                        <Tags className="text-purple-500 mb-2 group-hover:scale-110 transition-transform" size={20} />
                                    )}
                                    <p className="text-xs font-bold text-center">Sincronizar Categorías</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Settings size={22} className="text-primary" />
                            Configuración
                        </h2>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                <p className="font-bold group-hover:text-primary transition-colors">Ajustes del sitio</p>
                                <p className="text-sm text-foreground/60 line-clamp-1">Cambia banner, ofertas y textos generales.</p>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                <p className="font-bold group-hover:text-primary transition-colors">Usuarios y Permisos</p>
                                <p className="text-sm text-foreground/60 line-clamp-1">Gestiona roles de otros colaboradores.</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
