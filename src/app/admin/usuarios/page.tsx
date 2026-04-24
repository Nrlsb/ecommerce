'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, ArrowLeft, Loader2, 
    Trash2, Mail, Calendar, 
    UserCircle, ShieldAlert, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
    id: string;
    email: string;
    nombre: string;
    rol: string;
    created_at: string;
}

export default function UserManagement() {
    const { user: currentUser, profile: currentProfile, loading: authLoading } = useAuth();
    const router = useRouter();

    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (res.ok) {
                setUsers(data);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && (!currentUser || currentProfile?.rol !== 'admin')) {
            router.push('/admin');
            return;
        }
        fetchUsers();
    }, [currentUser, currentProfile, authLoading, router]);

    const handleRoleChange = async (userId: string, newRol: string) => {
        setIsActionLoading(userId);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, rol: newRol })
            });

            if (res.ok) {
                setStatus({ message: 'Rol actualizado con éxito', type: 'success' });
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, rol: newRol } : u));
            } else {
                throw new Error('Error al actualizar rol');
            }
        } catch (err) {
            setStatus({ message: (err as Error).message, type: 'error' });
        } finally {
            setIsActionLoading(null);
            setTimeout(() => setStatus({ message: '', type: '' }), 3000);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) return;

        setIsActionLoading(userId);
        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setStatus({ message: 'Usuario eliminado correctamente', type: 'success' });
                setUsers(prev => prev.filter(u => u.id !== userId));
            } else {
                throw new Error('No se pudo eliminar el usuario');
            }
        } catch (err) {
            setStatus({ message: (err as Error).message, type: 'error' });
        } finally {
            setIsActionLoading(null);
            setTimeout(() => setStatus({ message: '', type: '' }), 3000);
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary" size={48} />
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
                            <Users className="text-primary" size={32} />
                            Gestión de Usuarios
                        </h1>
                        <p className="text-foreground/60">Administra el acceso y roles de los colaboradores del sitio.</p>
                    </div>

                    <AnimatePresence>
                        {status.message && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`px-4 py-3 rounded-xl border shadow-sm flex items-center gap-3 ${
                                    status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-red-500/10 border-red-500/20 text-red-600'
                                }`}
                            >
                                {status.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
                                <span className="text-sm font-bold">{status.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Users Table */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground/60">Usuario</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground/60">Rol</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground/60">Fecha de Registro</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground/60 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <UserCircle size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{u.nombre || 'Sin nombre'}</p>
                                                    <p className="text-xs text-foreground/60 flex items-center gap-1">
                                                        <Mail size={12} /> {u.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={u.rol}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                disabled={isActionLoading === u.id || u.id === currentUser?.id}
                                                className="bg-muted border border-border text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer disabled:opacity-50"
                                            >
                                                <option value="admin">Administrador</option>
                                                <option value="vendedor">Vendedor</option>
                                                <option value="cliente">Cliente</option>
                                                <option value="usuario">Usuario Estándar</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-foreground/60 flex items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDeleteUser(u.id)}
                                                disabled={isActionLoading === u.id || u.id === currentUser?.id}
                                                className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-30"
                                                title="Eliminar usuario"
                                            >
                                                {isActionLoading === u.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {users.length === 0 && (
                        <div className="py-20 text-center text-foreground/40 italic">
                            No se encontraron usuarios registrados.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
