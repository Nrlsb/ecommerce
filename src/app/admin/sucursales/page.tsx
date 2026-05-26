'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, Plus, Edit2, Trash2, Loader2, 
    ArrowLeft, Save, Map, X, CheckCircle2, AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
  telefono: string | null;
  horarios: string | null;
  created_at?: string;
}

export default function AdminSucursales() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' }); // 'success' | 'error'

    // Estado para el modal de agregar/editar
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);
    
    // Campos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        latitud: '',
        longitud: '',
        telefono: '',
        horarios: ''
    });

    // Cargar sucursales
    const fetchSucursales = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/sucursales');
            if (res.ok) {
                const data = await res.json();
                setSucursales(data);
            } else {
                throw new Error('Error al cargar sucursales');
            }
        } catch (err) {
            console.error(err);
            showStatus('Error al cargar las sucursales', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && (!user || (profile?.rol !== 'admin' && profile?.rol !== 'vendedor'))) {
            router.push('/');
        } else if (user && (profile?.rol === 'admin' || profile?.rol === 'vendedor')) {
            fetchSucursales();
        }
    }, [user, profile, loading, router]);

    const showStatus = (message: string, type: 'success' | 'error') => {
        setStatus({ message, type });
        setTimeout(() => setStatus({ message: '', type: '' }), 5000);
    };

    const handleOpenAddModal = () => {
        setSelectedSucursal(null);
        setFormData({
            nombre: '',
            direccion: '',
            latitud: '',
            longitud: '',
            telefono: '',
            horarios: ''
        });
        setIsOpenModal(true);
    };

    const handleOpenEditModal = (sucursal: Sucursal) => {
        setSelectedSucursal(sucursal);
        setFormData({
            nombre: sucursal.nombre,
            direccion: sucursal.direccion,
            latitud: sucursal.latitud !== null ? String(sucursal.latitud) : '',
            longitud: sucursal.longitud !== null ? String(sucursal.longitud) : '',
            telefono: sucursal.telefono || '',
            horarios: sucursal.horarios || ''
        });
        setIsOpenModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const isEditing = !!selectedSucursal;
        const endpoint = '/api/admin/sucursales';
        const method = isEditing ? 'PUT' : 'POST';

        const payload = {
            id: selectedSucursal?.id,
            nombre: formData.nombre,
            direccion: formData.direccion,
            latitud: formData.latitud ? parseFloat(formData.latitud) : null,
            longitud: formData.longitud ? parseFloat(formData.longitud) : null,
            telefono: formData.telefono,
            horarios: formData.horarios
        };

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                showStatus(
                    isEditing ? 'Sucursal actualizada con éxito' : 'Sucursal agregada con éxito',
                    'success'
                );
                setIsOpenModal(false);
                fetchSucursales();
            } else {
                throw new Error(data.error || 'Ocurrió un error');
            }
        } catch (err: any) {
            showStatus(err.message || 'Error al guardar la sucursal', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta sucursal?')) return;

        try {
            const res = await fetch(`/api/admin/sucursales?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                showStatus('Sucursal eliminada con éxito', 'success');
                fetchSucursales();
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Error al eliminar');
            }
        } catch (err: any) {
            showStatus(err.message || 'Error al eliminar la sucursal', 'error');
        }
    };

    // Construir iframe del mapa para previsualización
    const getPreviewMapUrl = () => {
        if (formData.latitud && formData.longitud) {
            return `https://maps.google.com/maps?q=${formData.latitud},${formData.longitud}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
        if (formData.direccion) {
            return `https://maps.google.com/maps?q=${encodeURIComponent(formData.direccion)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
        return null;
    };

    if (loading || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-foreground/60 font-medium">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <Link href="/admin" className="inline-flex items-center text-sm text-foreground/60 hover:text-primary mb-2 transition-colors">
                            <ArrowLeft size={16} className="mr-1" /> Volver al panel de control
                        </Link>
                        <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                            <MapPin className="text-primary" size={32} />
                            Gestión de Sucursales
                        </h1>
                        <p className="text-foreground/60">Administra las sucursales físicas y su información en el mapa.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleOpenAddModal}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                        >
                            <Plus size={20} />
                            Nueva Sucursal
                        </button>
                    </div>
                </div>

                {/* Status Alerts */}
                <AnimatePresence>
                    {status.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg mb-6 max-w-xl ${status.type === 'success'
                                ? 'bg-green-500/10 border-green-500/20 text-green-600'
                                : 'bg-red-500/10 border-red-500/20 text-red-600'
                            }`}
                        >
                            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span className="text-sm font-bold">{status.message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Table / List */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-primary" size={36} />
                            <p className="text-sm text-foreground/60">Cargando sucursales...</p>
                        </div>
                    ) : sucursales.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border bg-muted/20">
                                        <th className="p-5 font-bold text-sm text-foreground/60">Nombre</th>
                                        <th className="p-5 font-bold text-sm text-foreground/60">Dirección</th>
                                        <th className="p-5 font-bold text-sm text-foreground/60">Teléfono</th>
                                        <th className="p-5 font-bold text-sm text-foreground/60">Horarios</th>
                                        <th className="p-5 font-bold text-sm text-foreground/60">Coordenadas</th>
                                        <th className="p-5 font-bold text-sm text-foreground/60 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sucursales.map((sucursal) => (
                                        <tr key={sucursal.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                                            <td className="p-5 font-bold text-foreground">{sucursal.nombre}</td>
                                            <td className="p-5 text-foreground/80">{sucursal.direccion}</td>
                                            <td className="p-5 text-foreground/80">{sucursal.telefono || <span className="text-muted-foreground/60 italic text-xs">No definido</span>}</td>
                                            <td className="p-5 text-foreground/80">{sucursal.horarios || <span className="text-muted-foreground/60 italic text-xs">No definido</span>}</td>
                                            <td className="p-5 text-foreground/60 text-xs">
                                                {sucursal.latitud && sucursal.longitud ? (
                                                    <span>{sucursal.latitud}, {sucursal.longitud}</span>
                                                ) : (
                                                    <span className="text-muted-foreground/50 italic">Solo dirección</span>
                                                )}
                                            </td>
                                            <td className="p-5 text-right flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(sucursal)}
                                                    className="p-2 text-foreground/60 hover:text-blue-600 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sucursal.id)}
                                                    className="p-2 text-foreground/60 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                            <Map className="text-muted-foreground/40 mb-4" size={48} />
                            <h3 className="text-lg font-bold text-foreground mb-1">No hay sucursales cargadas</h3>
                            <p className="text-sm text-foreground/60 mb-6 max-w-sm">
                                Comenzá cargando tu primera sucursal física para que tus clientes puedan verla en el mapa.
                            </p>
                            <button
                                onClick={handleOpenAddModal}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all cursor-pointer"
                            >
                                <Plus size={18} />
                                Cargar Sucursal
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Agregar / Editar */}
            <AnimatePresence>
                {isOpenModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-card w-full max-w-4xl rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
                                <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                                    {selectedSucursal ? <Edit2 size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
                                    {selectedSucursal ? 'Editar Sucursal' : 'Nueva Sucursal'}
                                </h2>
                                <button
                                    onClick={() => setIsOpenModal(false)}
                                    className="p-2 text-foreground/60 hover:text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body & Form */}
                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2">Nombre de la Sucursal *</label>
                                        <input
                                            type="text"
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                            className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl focus:outline-none focus:border-primary text-foreground transition-all"
                                            placeholder="Ej. Mercurio Sucursal San Martín"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2">Dirección *</label>
                                        <input
                                            type="text"
                                            value={formData.direccion}
                                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                            className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl focus:outline-none focus:border-primary text-foreground transition-all"
                                            placeholder="Ej. Av. San Martín 1542, Florida, Buenos Aires"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">Latitud (Opcional)</label>
                                            <input
                                                type="text"
                                                value={formData.latitud}
                                                onChange={(e) => setFormData({ ...formData, latitud: e.target.value })}
                                                className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl focus:outline-none focus:border-primary text-foreground transition-all"
                                                placeholder="-34.54215"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">Longitud (Opcional)</label>
                                            <input
                                                type="text"
                                                value={formData.longitud}
                                                onChange={(e) => setFormData({ ...formData, longitud: e.target.value })}
                                                className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl focus:outline-none focus:border-primary text-foreground transition-all"
                                                placeholder="-58.48912"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2">Teléfono de contacto (Opcional)</label>
                                        <input
                                            type="text"
                                            value={formData.telefono}
                                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                            className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl focus:outline-none focus:border-primary text-foreground transition-all"
                                            placeholder="Ej. 11 2233-4455"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2">Horarios (Opcional)</label>
                                        <input
                                            type="text"
                                            value={formData.horarios}
                                            onChange={(e) => setFormData({ ...formData, horarios: e.target.value })}
                                            className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl focus:outline-none focus:border-primary text-foreground transition-all"
                                            placeholder="Ej. Lunes a Viernes 08:00 a 17:00 hs, Sábados 08:30 a 13:00 hs"
                                        />
                                    </div>
                                </div>

                                {/* Vista previa del mapa */}
                                <div className="flex flex-col h-full min-h-[300px]">
                                    <span className="block text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2 flex items-center gap-1.5">
                                        <Map size={14} />
                                        Vista Previa del Mapa
                                    </span>
                                    <div className="flex-1 bg-muted/20 border border-border rounded-2xl overflow-hidden relative min-h-[250px]">
                                        {getPreviewMapUrl() ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                className="border-0 absolute inset-0"
                                                loading="lazy"
                                                allowFullScreen
                                                src={getPreviewMapUrl() || ''}
                                            ></iframe>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-foreground/40 italic">
                                                <MapPin size={36} className="mb-2 opacity-30 animate-bounce" />
                                                Ingresá una dirección o coordenadas para ver la previsualización del mapa.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Modal Footer Buttons */}
                                <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 border-t border-border mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpenModal(false)}
                                        className="px-5 py-3 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl transition-all cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        {selectedSucursal ? 'Guardar Cambios' : 'Crear Sucursal'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
