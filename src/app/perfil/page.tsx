'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Phone, MapPin, Award, Save, ClipboardList, LogOut, Loader2, Sparkles, Building } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PerfilPage() {
    const { user, loading: authLoading, refreshProfile, signOut } = useAuth();
    const router = useRouter();

    // Estados del formulario
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [provincia, setProvincia] = useState('');
    const [dni, setDni] = useState('');

    // Estados de UI
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Cargar datos del usuario en los estados una vez que estén listos
    useEffect(() => {
        if (user) {
            setNombre(user.nombre || '');
            setTelefono(user.telefono || '');
            setDireccion(user.direccion || '');
            setCiudad(user.ciudad || '');
            setCodigoPostal(user.codigo_postal || '');
            setProvincia(user.provincia || '');
            setDni(user.dni || '');
        }
    }, [user]);

    // Redirigir a login si no hay sesión iniciada y la carga terminó
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) {
            setMessage({ type: 'error', text: 'El nombre completo es obligatorio.' });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    telefono,
                    direccion,
                    ciudad,
                    codigo_postal: codigoPostal,
                    provincia,
                    dni
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' });
                await refreshProfile(); // Actualizar el contexto de autenticación global
            } else {
                setMessage({ type: 'error', text: data.error || 'Ocurrió un error al actualizar el perfil.' });
            }
        } catch (err) {
            console.error('Error al guardar perfil:', err);
            setMessage({ type: 'error', text: 'Error de red. Intenta nuevamente.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    if (authLoading || (!user && authLoading)) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-foreground/60 font-medium animate-pulse">Cargando tu información...</p>
            </div>
        );
    }

    if (!user) {
        return null; // El segundo useEffect ya redirige
    }

    // Iniciales para el avatar
    const obtenerIniciales = (name: string) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-muted/20 py-12 relative overflow-hidden">
            {/* Círculos decorativos premium */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-mercurio-blue/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-mercurio-yellow/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
                        Mi Perfil <Sparkles className="w-6 h-6 text-accent" />
                    </h1>
                    <p className="text-foreground/60 mt-1">Carga tus datos personales y de envío para facilitar tus compras.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Tarjeta del Perfil de Usuario (Izquierda) */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-border/80 p-8 rounded-[2rem] shadow-premium backdrop-blur-md flex flex-col items-center text-center relative overflow-hidden group"
                        >
                            {/* Color Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                                <div className="h-full flex-1 bg-mercurio-blue" />
                                <div className="h-full flex-1 bg-mercurio-yellow" />
                                <div className="h-full flex-1 bg-mercurio-green" />
                                <div className="h-full flex-1 bg-mercurio-pink" />
                            </div>

                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-mercurio-blue to-mercurio-pink flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary/20 mb-6 group-hover:scale-105 transition-transform duration-300">
                                {obtenerIniciales(nombre || user.email)}
                            </div>

                            <h2 className="text-xl font-extrabold text-foreground truncate max-w-full mb-1">{nombre || 'Usuario Mercurio'}</h2>
                            <p className="text-sm text-foreground/50 truncate max-w-full font-medium mb-4">{user.email}</p>

                            <span className="px-4 py-1.5 bg-primary/10 border border-primary/25 rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-6">
                                Rol: {user.rol || 'Cliente'}
                            </span>

                            <div className="w-full border-t border-border/60 pt-6 space-y-3">
                                <Link 
                                    href="/perfil/pedidos"
                                    className="flex items-center gap-3 w-full px-4 py-3 bg-muted/40 hover:bg-primary/5 border border-transparent hover:border-primary/10 rounded-xl text-sm font-bold text-foreground/75 hover:text-primary transition-all group/btn"
                                >
                                    <ClipboardList className="w-4 h-4 group-hover/btn:rotate-6 transition-transform" />
                                    <span>Mis Pedidos</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 bg-destructive/5 hover:bg-destructive/10 border border-transparent hover:border-destructive/20 rounded-xl text-sm font-bold text-destructive transition-all group/btn"
                                >
                                    <LogOut className="w-4 h-4 group-hover/btn:-translate-x-0.5 transition-transform" />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Formulario de Carga y Edición (Derecha) */}
                    <div className="lg:col-span-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-card border border-border/80 p-8 rounded-[2.2rem] shadow-premium backdrop-blur-md relative"
                        >
                            <h2 className="text-2xl font-black text-foreground mb-6">Datos Personales y de Envío</h2>

                            {message && (
                                <div className={`p-4 rounded-xl text-sm font-bold mb-6 border ${
                                    message.type === 'success' 
                                        ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400' 
                                        : 'bg-destructive/10 border-destructive/30 text-destructive'
                                }`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nombre Completo */}
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Nombre Completo *</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-foreground/30">
                                                <User className="w-4 h-4" />
                                            </span>
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full pl-11 pr-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors font-medium text-foreground"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                placeholder="Juan Pérez"
                                            />
                                        </div>
                                    </div>

                                    {/* Correo Electrónico (Deshabilitado) */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Email (No modificable)</label>
                                        <input 
                                            type="email" 
                                            disabled
                                            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl outline-none text-foreground/50 cursor-not-allowed font-medium"
                                            value={user.email}
                                        />
                                    </div>

                                    {/* DNI */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">DNI / CUIL / CUIT</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-foreground/30">
                                                <Award className="w-4 h-4" />
                                            </span>
                                            <input 
                                                type="text" 
                                                className="w-full pl-11 pr-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors font-medium text-foreground"
                                                value={dni}
                                                onChange={(e) => setDni(e.target.value)}
                                                placeholder="Ej. 35.123.456"
                                            />
                                        </div>
                                    </div>

                                    {/* Teléfono */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Teléfono de Contacto</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-foreground/30">
                                                <Phone className="w-4 h-4" />
                                            </span>
                                            <input 
                                                type="tel" 
                                                className="w-full pl-11 pr-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors font-medium text-foreground"
                                                value={telefono}
                                                onChange={(e) => setTelefono(e.target.value)}
                                                placeholder="Ej. 11 1234-5678"
                                            />
                                        </div>
                                    </div>

                                    {/* Provincia */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Provincia</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-foreground/30">
                                                <Building className="w-4 h-4" />
                                            </span>
                                            <select
                                                className="w-full pl-11 pr-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors font-medium text-foreground appearance-none"
                                                value={provincia}
                                                onChange={(e) => setProvincia(e.target.value)}
                                            >
                                                <option value="">Selecciona tu provincia...</option>
                                                <option value="caba">CABA (Ciudad Autónoma de Buenos Aires)</option>
                                                <option value="buenos_aires">Buenos Aires (Provincia)</option>
                                                <option value="catamarca">Catamarca</option>
                                                <option value="chaco">Chaco</option>
                                                <option value="chubut">Chubut</option>
                                                <option value="cordoba">Córdoba</option>
                                                <option value="corrientes">Corrientes</option>
                                                <option value="entre_rios">Entre Ríos</option>
                                                <option value="formosa">Formosa</option>
                                                <option value="jujuy">Jujuy</option>
                                                <option value="la_pampa">La Pampa</option>
                                                <option value="la_rioja">La Rioja</option>
                                                <option value="mendoza">Mendoza</option>
                                                <option value="misiones">Misiones</option>
                                                <option value="neuquen">Neuquén</option>
                                                <option value="rio_negro">Río Negro</option>
                                                <option value="salta">Salta</option>
                                                <option value="san_juan">San Juan</option>
                                                <option value="san_luis">San Luis</option>
                                                <option value="santa_cruz">Santa Cruz</option>
                                                <option value="santa_fe">Santa Fe</option>
                                                <option value="santiago_del_estero">Santiago del Estero</option>
                                                <option value="tierra_del_fuego">Tierra del Fuego</option>
                                                <option value="tucuman">Tucumán</option>
                                            </select>
                                            <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-foreground/30">
                                                ▼
                                            </span>
                                        </div>
                                    </div>

                                    {/* Dirección */}
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Dirección de Envío</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-foreground/30">
                                                <MapPin className="w-4 h-4" />
                                            </span>
                                            <input 
                                                type="text" 
                                                className="w-full pl-11 pr-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors font-medium text-foreground"
                                                value={direccion}
                                                onChange={(e) => setDireccion(e.target.value)}
                                                placeholder="Calle 123, Piso 1, Depto A"
                                            />
                                        </div>
                                    </div>

                                    {/* Ciudad */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Ciudad</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors font-medium text-foreground"
                                            value={ciudad}
                                            onChange={(e) => setCiudad(e.target.value)}
                                            placeholder="Ej. CABA / Tandil"
                                        />
                                    </div>

                                    {/* Código Postal */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Código Postal</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors font-medium text-foreground"
                                            value={codigoPostal}
                                            onChange={(e) => setCodigoPostal(e.target.value)}
                                            placeholder="Ej. 1425"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-border/60 pt-6 mt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex items-center justify-center gap-2 bg-primary text-white font-bold hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/20 px-8 py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group/save"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Guardando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5 group-hover/save:scale-110 transition-transform" />
                                                <span>Guardar Cambios</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
