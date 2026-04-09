'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Users, ShoppingBag, Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

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
