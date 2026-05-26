'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Package, ArrowLeft, Loader2, Save, Undo,
    Search, SlidersHorizontal, CheckCircle2, AlertCircle,
    Info, Star, StarOff
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Product {
    id: number;
    nombre: string;
    marca: string;
    precio: number;
    precio_con_descuento: number | null;
    stock: number;
    destacado: boolean;
    codigo_externo: string | null;
    categoria_id: number | null;
    categorias: {
        id: number;
        nombre: string;
    } | null;
}

interface ModifiedProduct {
    id: number;
    precio: number;
    precio_con_descuento: number | null;
    stock: number;
    destacado: boolean;
}

export default function BulkProductEdit() {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    
    // Cambios pendientes
    const [modifications, setModifications] = useState<{ [key: number]: ModifiedProduct }>({});
    
    // Estados de UI
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' }); // 'success' | 'error'

    // Cargar categorías y productos
    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            // Categorías para filtro
            const { data: cats } = await supabase
                .from('categorias')
                .select('id, nombre')
                .order('nombre');
            setCategories(cats || []);

            // Productos
            const res = await fetch(`/api/admin/productos?search=${encodeURIComponent(searchTerm)}&categoria=${selectedCategory}`);
            const data = await res.json();
            if (res.ok) {
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching admin products:', error);
            setStatus({ message: 'Error al cargar los productos.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && (!user || (profile?.rol !== 'admin' && profile?.rol !== 'vendedor'))) {
            router.push('/admin');
            return;
        }
        fetchInitialData();
    }, [user, profile, authLoading, router, selectedCategory]);

    // Buscar al presionar Enter o clickear Buscar
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchInitialData();
    };

    // Manejar cambios en inputs de la tabla
    const handleInputChange = (productId: number, field: keyof ModifiedProduct, value: any) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        setModifications(prev => {
            const currentMod = prev[productId] || {
                id: product.id,
                precio: product.precio,
                precio_con_descuento: product.precio_con_descuento,
                stock: product.stock,
                destacado: product.destacado
            };

            const updatedMod = {
                ...currentMod,
                [field]: value
            };

            // Verificar si el cambio es igual al estado original
            const isUnchanged = 
                Number(updatedMod.precio) === Number(product.precio) &&
                Number(updatedMod.precio_con_descuento || 0) === Number(product.precio_con_descuento || 0) &&
                Number(updatedMod.stock) === Number(product.stock) &&
                updatedMod.destacado === product.destacado;

            const copy = { ...prev };
            if (isUnchanged) {
                delete copy[productId];
            } else {
                copy[productId] = updatedMod;
            }
            return copy;
        });
    };

    // Descartar cambios individuales
    const handleDiscardIndividual = (productId: number) => {
        setModifications(prev => {
            const copy = { ...prev };
            delete copy[productId];
            return copy;
        });
    };

    // Descartar todos los cambios
    const handleDiscardAll = () => {
        setModifications({});
        setStatus({ message: 'Cambios descartados.', type: 'success' });
        setTimeout(() => setStatus({ message: '', type: '' }), 3000);
    };

    // Guardar todos los cambios
    const handleSaveChanges = async () => {
        const modsList = Object.values(modifications);
        if (modsList.length === 0) return;

        setIsSaving(true);
        setStatus({ message: 'Guardando cambios...', type: 'info' });

        try {
            const res = await fetch('/api/admin/productos', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(modsList)
            });

            const data = await res.json();

            if (res.ok || res.status === 270) {
                setStatus({
                    message: res.status === 270 
                        ? 'Actualización parcial: algunos productos fallaron.' 
                        : 'Cambios guardados exitosamente.',
                    type: res.status === 270 ? 'error' : 'success'
                });
                
                // Actualizar localmente los productos modificados con éxito
                const failedIds = data.errors?.map((e: any) => e.id) || [];
                setProducts(prev => prev.map(p => {
                    const mod = modifications[p.id];
                    if (mod && !failedIds.includes(p.id)) {
                        return {
                            ...p,
                            precio: mod.precio,
                            precio_con_descuento: mod.precio_con_descuento,
                            stock: mod.stock,
                            destacado: mod.destacado
                        };
                    }
                    return p;
                }));

                // Limpiar modificaciones exitosas
                setModifications(prev => {
                    const nextMods = { ...prev };
                    Object.keys(nextMods).forEach(idKey => {
                        const id = Number(idKey);
                        if (!failedIds.includes(id)) {
                            delete nextMods[id];
                        }
                    });
                    return nextMods;
                });

            } else {
                throw new Error(data.error || 'Error al guardar los cambios.');
            }
        } catch (error: any) {
            console.error('Error saving modifications:', error);
            setStatus({ message: error.message || 'Error al procesar la actualización.', type: 'error' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setStatus({ message: '', type: '' }), 4000);
        }
    };

    const hasChanges = Object.keys(modifications).length > 0;

    if (authLoading || (isLoading && products.length === 0)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-foreground/60 font-medium">Cargando productos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link href="/admin" className="inline-flex items-center text-sm text-foreground/60 hover:text-primary mb-2 transition-colors">
                            <ArrowLeft size={16} className="mr-1" /> Volver al panel
                        </Link>
                        <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                            <Package className="text-primary" size={32} />
                            Edición Masiva de Inventario
                        </h1>
                        <p className="text-foreground/60">Edita rápidamente precios, descuentos, stock y productos destacados de forma directa.</p>
                    </div>

                    <AnimatePresence>
                        {status.message && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 ${
                                    status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' :
                                    status.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600' :
                                    'bg-red-500/10 border-red-500/20 text-red-600'
                                }`}
                            >
                                {status.type === 'success' ? <CheckCircle2 size={18} /> : 
                                 status.type === 'info' ? <Loader2 className="animate-spin" size={18} /> : 
                                 <AlertCircle size={18} />}
                                <span className="text-sm font-bold">{status.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Filters Row */}
                <form onSubmit={handleSearchSubmit} className="bg-card border border-border p-6 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Buscar Producto</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Nombre, marca o código de barras..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors text-sm"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30 w-5 h-5" />
                        </div>
                    </div>

                    <div className="w-full md:w-64">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Categoría</label>
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors text-sm cursor-pointer appearance-none"
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </select>
                            <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 px-6 py-3 rounded-xl transition-all shadow-md text-sm w-full md:w-auto h-[46px] flex items-center justify-center gap-2"
                    >
                        Buscar
                    </button>
                </form>

                {/* Products Table */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Producto</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 w-40">Precio Original ($)</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 w-40">Precio Oferta ($)</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 w-32">Stock</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 w-28 text-center">Destacado</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 w-24 text-right">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {products.map((product) => {
                                    const mod = modifications[product.id];
                                    const isModded = !!mod;
                                    
                                    const displayPrecio = mod ? mod.precio : product.precio;
                                    const displayPrecioDesc = mod ? mod.precio_con_descuento : product.precio_con_descuento;
                                    const displayStock = mod ? mod.stock : product.stock;
                                    const displayDestacado = mod ? mod.destacado : product.destacado;

                                    return (
                                        <tr key={product.id} className={`hover:bg-muted/10 transition-colors ${isModded ? 'bg-amber-500/5' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="max-w-[280px] md:max-w-md">
                                                    <p className="font-bold text-sm text-foreground truncate" title={product.nombre}>
                                                        {product.nombre}
                                                    </p>
                                                    <p className="text-xs text-foreground/40 mt-1 truncate">
                                                        {product.marca || 'Sin Marca'} {product.codigo_externo ? `• Cód: ${product.codigo_externo}` : ''}
                                                    </p>
                                                </div>
                                            </td>
                                            
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={displayPrecio}
                                                    onChange={(e) => handleInputChange(product.id, 'precio', parseFloat(e.target.value) || 0)}
                                                    className={`w-full px-3 py-1.5 bg-background border rounded-lg text-sm font-semibold outline-none focus:ring-1 focus:ring-primary ${
                                                        isModded && mod.precio !== product.precio ? 'border-amber-500 text-amber-600 bg-amber-500/5' : 'border-border'
                                                    }`}
                                                />
                                            </td>

                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="Sin oferta"
                                                    value={displayPrecioDesc === null ? '' : displayPrecioDesc}
                                                    onChange={(e) => {
                                                        const val = e.target.value === '' ? null : parseFloat(e.target.value);
                                                        handleInputChange(product.id, 'precio_con_descuento', val);
                                                    }}
                                                    className={`w-full px-3 py-1.5 bg-background border rounded-lg text-sm font-semibold outline-none focus:ring-1 focus:ring-primary ${
                                                        isModded && mod.precio_con_descuento !== product.precio_con_descuento ? 'border-amber-500 text-amber-600 bg-amber-500/5' : 'border-border'
                                                    }`}
                                                />
                                            </td>

                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={displayStock}
                                                    onChange={(e) => handleInputChange(product.id, 'stock', parseInt(e.target.value) || 0)}
                                                    className={`w-full px-3 py-1.5 bg-background border rounded-lg text-sm font-semibold outline-none focus:ring-1 focus:ring-primary ${
                                                        isModded && mod.stock !== product.stock ? 'border-amber-500 text-amber-600 bg-amber-500/5' : 'border-border'
                                                    }`}
                                                />
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleInputChange(product.id, 'destacado', !displayDestacado)}
                                                    className={`p-2 rounded-xl transition-all ${
                                                        displayDestacado ? 'text-amber-500 hover:text-amber-600' : 'text-foreground/20 hover:text-foreground/40'
                                                    }`}
                                                >
                                                    {displayDestacado ? <Star size={20} className="fill-amber-500" /> : <StarOff size={20} />}
                                                </button>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                {isModded ? (
                                                    <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-amber-600">
                                                        <span>Editado</span>
                                                        <button 
                                                            onClick={() => handleDiscardIndividual(product.id)}
                                                            className="text-foreground/30 hover:text-red-500 p-1"
                                                            title="Descartar cambios de este producto"
                                                        >
                                                            <Undo size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-foreground/30">Sin cambios</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}

                                {products.length === 0 && !isLoading && (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center text-foreground/40 italic">
                                            No se encontraron productos con los filtros seleccionados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Floating Save Bar */}
                <AnimatePresence>
                    {hasChanges && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-2xl w-11/12 bg-slate-900 border border-slate-800 text-slate-100 px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 z-50 backdrop-blur-md bg-opacity-95"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                                    <Info size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Cambios pendientes</p>
                                    <p className="text-xs text-slate-400">Hay {Object.keys(modifications).length} productos modificados sin guardar.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleDiscardAll}
                                    disabled={isSaving}
                                    className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 hover:text-slate-100 transition-colors disabled:opacity-50"
                                >
                                    Descartar
                                </button>
                                
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={isSaving}
                                    className="bg-amber-500 text-slate-950 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={14} />}
                                    Guardar
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
