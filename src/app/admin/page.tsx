'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, Package, Users, ShoppingBag, Settings, 
    ArrowLeft, RefreshCw, Tags, CheckCircle2, AlertCircle, 
    Loader2, FileDown, TrendingUp, BarChart3, AlertTriangle, 
    Search, UserCog
} from 'lucide-react';
import Link from 'next/link';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function AdminDashboard() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    const [syncingProducts, setSyncingProducts] = useState(false);
    const [syncingCategories, setSyncingCategories] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' }); // 'success' | 'error' | 'info'
    
    const [statsData, setStatsData] = useState<any>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                if (res.ok) {
                    setStatsData(data);
                }
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setIsLoadingStats(false);
            }
        };

        if (user && profile?.rol === 'admin') {
            fetchStats();
        }
    }, [user, profile]);

    const handleSync = async (type: 'products' | 'categories') => {
        const isProducts = type === 'products';
        const setSyncing = isProducts ? setSyncingProducts : setSyncingCategories;
        const endpoint = isProducts ? '/api/sync-products' : '/api/sync-categories';
        const label = isProducts ? 'productos' : 'categorías';

        setSyncing(true);
        setStatus({ message: `Sincronizando ${label}...`, type: 'info' });

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
            setTimeout(() => setStatus({ message: '', type: '' }), 5000);
        }
    };

    const handleExport = async () => {
        setExporting(true);
        setStatus({ message: 'Generando archivo Excel...', type: 'info' });

        try {
            const res = await fetch('/api/admin/export-products');

            if (!res.ok) {
                let errorMsg = 'Error al generar el Excel';
                try {
                    const data = await res.json();
                    errorMsg = data.details || data.error || errorMsg;
                } catch (e) {
                    errorMsg = `Error del servidor (${res.status}): ${res.statusText}`;
                }
                throw new Error(errorMsg);
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
        if (!loading && (!user || (profile?.rol !== 'admin' && profile?.rol !== 'vendedor'))) {
            router.push('/');
        }
    }, [user, profile, loading, router]);

    if (loading || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-foreground/60 font-medium">Cargando panel...</p>
                </div>
            </div>
        );
    }

    const stats = [
        { label: 'Productos', value: statsData?.stats?.totalProducts || '...', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Usuarios', value: statsData?.stats?.totalUsers || '...', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Pedidos', value: statsData?.stats?.totalOrders || '...', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-100' },
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
                        <p className="text-foreground/60">Bienvenido, {profile.nombre || 'Administrador'}. Gestión operacional y analíticas.</p>
                    </div>

                    <AnimatePresence>
                        {status.message && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${status.type === 'success'
                                    ? 'bg-green-500/10 border-green-500/20 text-green-600'
                                    : status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-600' : 'bg-blue-500/10 border-blue-500/20 text-blue-600'
                                    }`}
                            >
                                {status.type === 'success' ? <CheckCircle2 size={18} /> : status.type === 'error' ? <AlertCircle size={18} /> : <Loader2 className="animate-spin" size={18} />}
                                <span className="text-sm font-bold">{status.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5 hover:border-primary/30 transition-all group"
                        >
                            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground/60 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-3xl font-black text-foreground">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts & Real-time Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Sales by Brand Chart */}
                    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp size={22} className="text-primary" />
                                Ventas por Marca
                            </h2>
                            <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full uppercase">Top 5</span>
                        </div>
                        <div className="h-64 w-full">
                            {isLoadingStats ? (
                                <div className="h-full w-full flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
                            ) : statsData?.salesByBrand?.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statsData.salesByBrand}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                            formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Total Ventas']}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {statsData.salesByBrand.map((_: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center text-foreground/40 italic">
                                    <BarChart3 size={40} className="mb-2 opacity-20" />
                                    No hay datos de ventas disponibles
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <AlertTriangle size={22} className="text-orange-500" />
                                Alertas de Stock Bajo
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {isLoadingStats ? (
                                Array(3).fill(0).map((_, i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-xl" />)
                            ) : statsData?.lowStock?.length > 0 ? (
                                statsData.lowStock.map((prod: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                        <div>
                                            <p className="font-bold text-sm text-foreground">{prod.nombre}</p>
                                            <p className="text-xs text-foreground/60">{prod.marca}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-orange-600">{prod.stock}</p>
                                            <p className="text-[10px] font-bold text-orange-500 uppercase">Quedan pocos</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-foreground/40 italic">Todo el stock está en niveles saludables.</div>
                            )}
                        </div>
                    </div>
                    
                    {/* Top Searches */}
                    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Search size={22} className="text-blue-500" />
                                Productos más Buscados
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {isLoadingStats ? (
                                <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" /></div>
                            ) : statsData?.topSearches?.length > 0 ? (
                                <div className="relative h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statsData.topSearches}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="conteo"
                                                nameKey="query"
                                            >
                                                {statsData.topSearches.map((_: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                            />
                                            <Legend verticalAlign="middle" align="right" layout="vertical" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="text-center py-10 text-foreground/40 italic">No hay registros de búsqueda aún.</div>
                            )}
                        </div>
                    </div>

                    {/* Operations Management */}
                    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Settings size={22} className="text-primary" />
                            Operaciones y Gestión
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex gap-4">
                                <Link href="/admin/usuarios" className="flex-1 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:scale-110 transition-transform">
                                        <UserCog size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold group-hover:text-primary transition-colors">Gestión de Usuarios</p>
                                        <p className="text-xs text-foreground/60">Administra roles y permisos.</p>
                                    </div>
                                </Link>
                                
                                <button 
                                    onClick={handleExport}
                                    disabled={exporting}
                                    className="flex-1 p-4 rounded-xl border border-green-500/20 bg-green-500/5 hover:border-green-500/50 hover:bg-green-500/10 transition-all group flex items-center gap-4 disabled:opacity-50"
                                >
                                    <div className="p-3 bg-green-500/10 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                                        {exporting ? <Loader2 className="animate-spin" size={20} /> : <FileDown size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-bold group-hover:text-green-700 transition-colors">Exportar Inventario</p>
                                        <p className="text-xs text-foreground/60">Descarga a Excel (.xlsx)</p>
                                    </div>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleSync('products')}
                                    disabled={syncingProducts}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group disabled:opacity-50"
                                >
                                    {syncingProducts ? <Loader2 className="animate-spin text-blue-500 mb-2" size={20} /> : <RefreshCw className="text-blue-500 mb-2 group-hover:rotate-180 transition-transform duration-500" size={20} />}
                                    <p className="text-xs font-bold">Sync Productos</p>
                                </button>

                                <button
                                    onClick={() => handleSync('categories')}
                                    disabled={syncingCategories}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group disabled:opacity-50"
                                >
                                    {syncingCategories ? <Loader2 className="animate-spin text-purple-500 mb-2" size={20} /> : <Tags className="text-purple-500 mb-2 group-hover:scale-110 transition-transform" size={20} />}
                                    <p className="text-xs font-bold">Sync Categorías</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
