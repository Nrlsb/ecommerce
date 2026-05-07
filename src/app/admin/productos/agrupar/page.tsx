
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Package, Link as LinkIcon, Unlink, 
    Plus, Save, Loader2, ArrowLeft, CheckCircle2,
    Filter, X
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function GroupProductsPage() {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();

    const [products, setProducts] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [newGroupName, setNewGroupName] = useState('');

    useEffect(() => {
        if (!authLoading && (!user || profile?.rol !== 'admin')) {
            router.push('/admin');
        }
    }, [user, profile, authLoading, router]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/productos/agrupar?search=${searchTerm}`);
            const data = await res.json();
            if (res.ok) {
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length >= 3 || searchTerm.length === 0) {
                fetchProducts();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleToggleSelect = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleGroup = async (desagrupar = false) => {
        if (selectedIds.length === 0) return;
        if (!desagrupar && !newGroupName) {
            setStatus({ message: 'Escribe un nombre para el grupo', type: 'error' });
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/productos/agrupar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productIds: selectedIds,
                    familiaName: desagrupar ? null : newGroupName,
                    familiaId: null // Podríamos añadir un selector de familias existentes luego
                })
            });

            if (res.ok) {
                setStatus({ message: desagrupar ? 'Productos desagrupados' : 'Grupo creado con éxito', type: 'success' });
                setSelectedIds([]);
                setNewGroupName('');
                fetchProducts();
            } else {
                throw new Error('Error al procesar la solicitud');
            }
        } catch (error: any) {
            setStatus({ message: error.message, type: 'error' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setStatus({ message: '', type: '' }), 3000);
        }
    };

    if (authLoading || !profile) return null;

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="mb-10">
                    <Link href="/admin" className="inline-flex items-center text-sm text-foreground/60 hover:text-primary mb-4 transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Volver al panel
                    </Link>
                    <h1 className="text-4xl font-black text-foreground flex items-center gap-3">
                        <LinkIcon className="text-primary" size={36} />
                        Agrupador de Variantes
                    </h1>
                    <p className="text-foreground/60 mt-2 text-lg">Asocia productos para que aparezcan como opciones de color/tamaño en la misma página.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Panel Izquierdo: Selección */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Buscar por nombre o código..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-muted/20 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {isLoading ? (
                                    <div className="py-20 flex flex-col items-center gap-4">
                                        <Loader2 className="animate-spin text-primary" size={40} />
                                        <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Buscando productos...</p>
                                    </div>
                                ) : products.length > 0 ? (
                                    products.map((prod) => (
                                        <div 
                                            key={prod.id}
                                            onClick={() => handleToggleSelect(prod.id)}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                                                selectedIds.includes(prod.id) 
                                                    ? 'bg-primary/5 border-primary shadow-md' 
                                                    : 'bg-background border-border hover:border-primary/30'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                    selectedIds.includes(prod.id) ? 'bg-primary text-white' : 'bg-muted text-foreground/40'
                                                }`}>
                                                    <Package size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm leading-tight">{prod.nombre}</p>
                                                    <p className="text-[10px] font-black uppercase text-foreground/40 tracking-widest mt-1">
                                                        {prod.marca} • {prod.producto_familias?.nombre || <span className="text-orange-500/60 italic">Sin grupo</span>}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                selectedIds.includes(prod.id) ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/30'
                                            }`}>
                                                {selectedIds.includes(prod.id) && <CheckCircle2 size={14} className="text-white" />}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center text-foreground/40 italic">
                                        No se encontraron productos para tu búsqueda.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Panel Derecho: Acciones */}
                    <div className="space-y-6">
                        <div className="bg-card p-8 rounded-3xl border border-border shadow-xl sticky top-8">
                            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                                <Plus className="text-primary" size={24} />
                                Gestionar Selección
                            </h2>

                            <div className="mb-8">
                                <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2">Productos seleccionados</p>
                                <div className="text-3xl font-black text-primary">{selectedIds.length}</div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 block">Nombre del Grupo (Familia)</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: Albalux Brillante"
                                        value={newGroupName}
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-muted/20 focus:border-primary outline-none font-bold"
                                    />
                                    <p className="text-[10px] text-foreground/40 mt-2 italic">Esto creará una nueva familia o usará una existente con este nombre.</p>
                                </div>

                                <button
                                    onClick={() => handleGroup(false)}
                                    disabled={isSaving || selectedIds.length === 0}
                                    className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    Agrupar Selección
                                </button>

                                <button
                                    onClick={() => handleGroup(true)}
                                    disabled={isSaving || selectedIds.length === 0}
                                    className="w-full py-4 rounded-2xl bg-muted text-foreground/60 font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-500/10 hover:text-red-600 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <Unlink size={20} />
                                    Desagrupar
                                </button>
                            </div>

                            <AnimatePresence>
                                {status.message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className={`mt-6 p-4 rounded-xl border text-center text-sm font-bold ${
                                            status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-red-500/10 border-red-500/20 text-red-600'
                                        }`}
                                    >
                                        {status.message}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
