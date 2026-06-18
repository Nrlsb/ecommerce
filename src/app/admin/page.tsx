'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, Package, Users, ShoppingBag, Settings, 
    ArrowLeft, RefreshCw, Tags, CheckCircle2, AlertCircle, 
    Loader2, FileDown, TrendingUp, BarChart3, AlertTriangle, 
    Search, UserCog, Link as LinkIcon, Undo2, MapPin
} from 'lucide-react';
import Link from 'next/link';
import { 
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar
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
        { 
            label: 'Productos', 
            value: statsData?.stats?.totalProducts || '...', 
            icon: Package, 
            color: 'text-blue-600 dark:text-blue-400', 
            bg: 'bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20', 
            href: '#' 
        },
        { 
            label: 'Usuarios', 
            value: statsData?.stats?.totalUsers || '...', 
            icon: Users, 
            color: 'text-green-600 dark:text-green-400', 
            bg: 'bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20', 
            href: '/admin/usuarios' 
        },
        { 
            label: 'Pedidos', 
            value: statsData?.stats?.totalOrders || '...', 
            icon: ShoppingBag, 
            color: 'text-purple-600 dark:text-purple-400', 
            bg: 'bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20', 
            href: '/admin/pedidos' 
        },
        { 
            label: 'Sin Imagen', 
            value: statsData?.noImageProducts?.length ?? '...', 
            icon: AlertTriangle, 
            color: 'text-red-600 dark:text-red-400', 
            bg: 'bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20', 
            href: '#no-image-section' 
        },
    ];

    return (
        <div className="min-h-screen bg-muted/30 pb-20 relative overflow-hidden">
            {/* Background Glow Blobs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 dark:bg-blue-500/[0.03] rounded-full filter blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute top-[35%] right-1/4 w-[400px] h-[400px] bg-accent/5 dark:bg-pink-500/[0.02] rounded-full filter blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-500/[0.03] rounded-full filter blur-[80px] -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <Link href="/" className="inline-flex items-center text-sm text-foreground/60 hover:text-primary mb-2 transition-colors">
                            <ArrowLeft size={16} className="mr-1" /> Volver a la tienda
                        </Link>
                        <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                            <LayoutDashboard className="text-primary dark:text-blue-400" size={32} />
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
                                    ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
                                    : status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
                                    }`}
                            >
                                {status.type === 'success' ? <CheckCircle2 size={18} /> : status.type === 'error' ? <AlertCircle size={18} /> : <Loader2 className="animate-spin" size={18} />}
                                <span className="text-sm font-bold">{status.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <Link key={idx} href={stat.href}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm flex items-center gap-5 hover:border-primary/40 hover:bg-primary/5 hover:scale-[1.02] transition-all duration-300 group h-full cursor-pointer relative overflow-hidden premium-border-hover"
                            >
                                <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon size={28} />
                                </div>
                                <div className="z-10">
                                    <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-3xl font-black text-foreground mt-0.5">{stat.value}</p>
                                </div>
                                <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:scale-125 transition-transform duration-500">
                                    <stat.icon size={100} />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm flex items-center gap-5 hover:scale-[1.02] hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-all duration-300 relative overflow-hidden group">
                        <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                            <TrendingUp size={28} />
                        </div>
                        <div className="z-10">
                            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Facturación Total</p>
                            <p className="text-3xl font-black text-foreground mt-0.5">
                                ${statsData?.stats?.totalRevenue ? Number(statsData.stats.totalRevenue).toLocaleString('es-AR') : '0'}
                            </p>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Ventas aprobadas y despachadas
                            </p>
                        </div>
                        <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:scale-125 transition-transform duration-500">
                            <TrendingUp size={100} className="text-emerald-500" />
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm flex items-center gap-5 hover:scale-[1.02] hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all duration-300 relative overflow-hidden group">
                        <div className="p-4 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle2 size={28} />
                        </div>
                        <div className="z-10">
                            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Ticket Promedio</p>
                            <p className="text-3xl font-black text-foreground mt-0.5">
                                ${statsData?.stats?.averageOrderValue ? Math.round(Number(statsData.stats.averageOrderValue)).toLocaleString('es-AR') : '0'}
                            </p>
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1 flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                Monto medio por compra
                            </p>
                        </div>
                        <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:scale-125 transition-transform duration-500">
                            <CheckCircle2 size={100} className="text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm flex items-center gap-5 hover:scale-[1.02] hover:border-purple-500/30 hover:bg-purple-500/[0.02] transition-all duration-300 relative overflow-hidden group">
                        <div className="p-4 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                            <ShoppingBag size={28} />
                        </div>
                        <div className="z-10">
                            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Pedidos Pagados</p>
                            <p className="text-3xl font-black text-foreground mt-0.5">
                                {statsData?.stats?.paidOrdersCount || '0'}
                            </p>
                            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-1 flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                Órdenes cobradas con éxito
                            </p>
                        </div>
                        <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:scale-125 transition-transform duration-500">
                            <ShoppingBag size={100} className="text-purple-500" />
                        </div>
                    </div>
                </div>

                {/* Sales Evolution Chart */}
                <div className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <TrendingUp size={22} className="text-primary dark:text-blue-400" />
                            Evolución Mensual de Ventas
                        </h2>
                        <span className="text-xs font-bold px-2.5 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full uppercase">Ingresos ($)</span>
                    </div>
                    <div className="h-72 w-full">
                        {isLoadingStats ? (
                            <div className="h-full w-full flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
                        ) : statsData?.salesEvolution?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={statsData.salesEvolution}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" className="opacity-60" />
                                    <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                                    <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" tickFormatter={(val) => `$${val.toLocaleString('es-AR')}`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15)' }}
                                        formatter={(val: any) => [`$${Number(val).toLocaleString('es-AR')}`, 'Ventas']}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full w-full flex flex-col items-center justify-center text-foreground/40 italic">
                                <BarChart3 size={40} className="mb-2 opacity-20" />
                                No hay datos de facturación disponibles
                            </div>
                        )}
                    </div>
                </div>

                {/* Charts & Real-time Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Sales by Brand Chart */}
                    <div className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp size={22} className="text-primary dark:text-blue-400" />
                                Ventas por Marca
                            </h2>
                            <span className="text-xs font-bold px-2.5 py-1 bg-primary/10 text-primary dark:bg-blue-500/10 dark:text-blue-400 rounded-full uppercase">Top 5</span>
                        </div>
                        <div className="h-64 w-full">
                            {isLoadingStats ? (
                                <div className="h-full w-full flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
                            ) : statsData?.salesByBrand?.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statsData.salesByBrand}>
                                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" className="opacity-60" />
                                        <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                                        <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" tickFormatter={(val) => `$${val / 1000}k`} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15)' }}
                                            formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Total Ventas']}
                                        />
                                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
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
                    <div className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm">
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
                                            <p className="text-lg font-black text-orange-600 dark:text-orange-400">{prod.stock}</p>
                                            <p className="text-[10px] font-bold text-orange-500 uppercase">Quedan pocos</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-foreground/40 italic">Todo el stock está en niveles saludables.</div>
                            )}
                        </div>
                    </div>
                    
                    {/* Products Without Image */}
                    <div id="no-image-section" className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <AlertTriangle size={22} className="text-red-500" />
                                Productos sin Imagen
                            </h2>
                            <span className="text-xs font-bold px-2.5 py-1 bg-red-500/10 text-red-600 rounded-full">
                                {statsData?.noImageProducts?.length || 0} Ocultos
                            </span>
                        </div>
                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
                            {isLoadingStats ? (
                                Array(3).fill(0).map((_, i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-xl" />)
                            ) : statsData?.noImageProducts?.length > 0 ? (
                                statsData.noImageProducts.map((prod: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all">
                                        <div className="min-w-0 flex-1 mr-4">
                                            <p className="font-bold text-sm text-foreground truncate">{prod.nombre}</p>
                                            <p className="text-xs text-foreground/60 truncate">
                                                {prod.marca || 'Sin Marca'} {prod.codigo_externo ? `• Cód: ${prod.codigo_externo}` : ''}
                                            </p>
                                        </div>
                                        <Link 
                                            href={`/catalogo/${prod.id}`}
                                            className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
                                        >
                                            Ver Detalle
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-foreground/40 italic">
                                    ¡Todos los productos tienen imagen! No hay productos ocultos.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Searches */}
                    <div className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm">
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
                                                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15)' }}
                                            />
                                            <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{ color: 'var(--foreground)', fontSize: '12px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="text-center py-10 text-foreground/40 italic">No hay registros de búsqueda aún.</div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Operations Management */}
                <div className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm relative overflow-hidden">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Settings size={22} className="text-primary dark:text-blue-400" />
                        Operaciones y Gestión
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Card 1: Edición Masiva */}
                        <Link href="/admin/productos" className="p-5 rounded-xl border border-border/80 bg-card hover:border-blue-500/50 hover:bg-blue-500/[0.03] hover:scale-[1.02] transition-all duration-300 group flex items-start gap-4">
                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                <Package size={22} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-foreground group-hover:text-blue-500 transition-colors">Edición Masiva</h3>
                                <p className="text-xs text-foreground/60 mt-1 leading-relaxed">Actualiza precios y stock de productos de forma masiva.</p>
                            </div>
                        </Link>

                        {/* Card 2: Gestión de Usuarios */}
                        <Link href="/admin/usuarios" className="p-5 rounded-xl border border-border/80 bg-card hover:border-purple-500/50 hover:bg-purple-500/[0.03] hover:scale-[1.02] transition-all duration-300 group flex items-start gap-4">
                            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                <UserCog size={22} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-foreground group-hover:text-purple-500 transition-colors">Gestión de Usuarios</h3>
                                <p className="text-xs text-foreground/60 mt-1 leading-relaxed">Administra roles, permisos y accesos de los usuarios.</p>
                            </div>
                        </Link>

                        {/* Card 3: Gestión de Sucursales */}
                        <Link href="/admin/sucursales" className="p-5 rounded-xl border border-border/80 bg-card hover:border-sky-500/50 hover:bg-sky-500/[0.03] hover:scale-[1.02] transition-all duration-300 group flex items-start gap-4">
                            <div className="p-3 bg-sky-500/10 text-sky-500 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                <MapPin size={22} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-foreground group-hover:text-sky-500 transition-colors">Gestión de Sucursales</h3>
                                <p className="text-xs text-foreground/60 mt-1 leading-relaxed">Carga sucursales físicas, horarios y edita el mapa.</p>
                            </div>
                        </Link>

                        {/* Card 4: Exportar Inventario */}
                        <button 
                            onClick={handleExport}
                            disabled={exporting}
                            className="p-5 rounded-xl border border-border/80 bg-card hover:border-green-500/50 hover:bg-green-500/[0.03] hover:scale-[1.02] transition-all duration-300 group flex items-start gap-4 text-left w-full h-full disabled:opacity-50 cursor-pointer"
                        >
                            <div className="p-3 bg-green-500/10 text-green-500 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                {exporting ? <Loader2 className="animate-spin" size={22} /> : <FileDown size={22} />}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-foreground group-hover:text-green-500 transition-colors">Exportar Inventario</h3>
                                <p className="text-xs text-foreground/60 mt-1 leading-relaxed">Descarga todo el catálogo de productos a Excel (.xlsx).</p>
                            </div>
                        </button>

                        {/* Card 5: Arrepentimiento */}
                        <Link href="/admin/arrepentimientos" className="p-5 rounded-xl border border-border/80 bg-card hover:border-red-500/50 hover:bg-red-500/[0.03] hover:scale-[1.02] transition-all duration-300 group flex items-start gap-4">
                            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                <Undo2 size={22} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-foreground group-hover:text-red-500 transition-colors">Arrepentimiento</h3>
                                <p className="text-xs text-foreground/60 mt-1 leading-relaxed">Gestiona solicitudes de devolución y arrepentimiento.</p>
                            </div>
                        </Link>

                        {/* Card 6: Sync Productos */}
                        <button
                            onClick={() => handleSync('products')}
                            disabled={syncingProducts}
                            className="p-5 rounded-xl border border-border/80 bg-card hover:border-indigo-500/50 hover:bg-indigo-500/[0.03] hover:scale-[1.02] transition-all duration-300 group flex items-start gap-4 text-left w-full h-full disabled:opacity-50 cursor-pointer"
                        >
                            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                {syncingProducts ? <Loader2 className="animate-spin" size={22} /> : <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" size={22} />}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-foreground group-hover:text-indigo-500 transition-colors">Sync Productos</h3>
                                <p className="text-xs text-foreground/60 mt-1 leading-relaxed">Sincroniza stock y precios con el sistema Protheus.</p>
                            </div>
                        </button>

                        {/* Card 7: Sync Categorías */}
                        <button
                            onClick={() => handleSync('categories')}
                            disabled={syncingCategories}
                            className="p-5 rounded-xl border border-border/80 bg-card hover:border-pink-500/50 hover:bg-pink-500/[0.03] hover:scale-[1.02] transition-all duration-300 group flex items-start gap-4 text-left w-full h-full disabled:opacity-50 cursor-pointer"
                        >
                            <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                {syncingCategories ? <Loader2 className="animate-spin" size={22} /> : <Tags size={22} />}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-foreground group-hover:text-pink-500 transition-colors">Sync Categorías</h3>
                                <p className="text-xs text-foreground/60 mt-1 leading-relaxed">Sincroniza el árbol de categorías con el backend.</p>
                            </div>
                        </button>

                        {/* Card 8: Agrupador de Variantes */}
                        <Link href="/admin/productos/agrupar" className="p-5 rounded-xl border border-border/80 bg-card hover:border-emerald-500/50 hover:bg-emerald-500/[0.03] hover:scale-[1.02] transition-all duration-300 group flex items-start gap-4">
                            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                <LinkIcon size={22} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-foreground group-hover:text-emerald-500 transition-colors">Agrupador de Variantes</h3>
                                <p className="text-xs text-foreground/60 mt-1 leading-relaxed">Agrupa colores y tamaños de variantes manualmente.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
