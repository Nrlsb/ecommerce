'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, Phone, Clock, Loader2, Navigation, Map, ExternalLink 
} from 'lucide-react';

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
  telefono: string | null;
  horarios: string | null;
}

export default function SucursalesPage() {
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSucursales = async () => {
            try {
                const res = await fetch('/api/sucursales');
                if (res.ok) {
                    const data = await res.json();
                    setSucursales(data);
                    if (data.length > 0) {
                        setSelectedSucursal(data[0]); // Seleccionar la primera por defecto
                    }
                }
            } catch (err) {
                console.error('Error al obtener sucursales:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSucursales();
    }, []);

    // Iframe de Google Maps
    const getMapUrl = (sucursal: Sucursal) => {
        if (sucursal.latitud && sucursal.longitud) {
            return `https://maps.google.com/maps?q=${sucursal.latitud},${sucursal.longitud}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
        }
        return `https://maps.google.com/maps?q=${encodeURIComponent(sucursal.direccion)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    };

    // Enlace de Google Maps externo para navegación GPS
    const getExternalMapUrl = (sucursal: Sucursal) => {
        if (sucursal.latitud && sucursal.longitud) {
            return `https://www.google.com/maps/search/?api=1&query=${sucursal.latitud},${sucursal.longitud}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sucursal.direccion)}`;
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden py-16">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-mercurio-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-mercurio-pink/5 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Cabecera */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-mercurio-blue/20 to-mercurio-pink/20 border border-white/10 text-mercurio-pink mb-4">
                        <MapPin className="w-3.5 h-3.5" />
                        Puntos de Venta
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Nuestras Sucursales
                    </h1>
                    <p className="text-slate-400 text-lg font-light leading-relaxed">
                        Encontrá la sucursal de Pinturerías Mercurio más cercana. Vení a visitarnos, descubrí nuestra amplia gama de productos y recibí asesoramiento profesional personalizado.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-mercurio-pink" size={48} />
                        <p className="text-slate-400 text-sm font-medium">Cargando sucursales de Mercurio...</p>
                    </div>
                ) : sucursales.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        
                        {/* Columna Izquierda: Tarjetas de Sucursales */}
                        <div className="lg:col-span-5 flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                            {sucursales.map((sucursal) => {
                                const isSelected = selectedSucursal?.id === sucursal.id;
                                return (
                                    <motion.div
                                        key={sucursal.id}
                                        whileHover={{ y: -2, scale: 1.01 }}
                                        onClick={() => setSelectedSucursal(sucursal)}
                                        className={`glass p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col gap-4 relative overflow-hidden group ${
                                            isSelected 
                                                ? 'bg-slate-900/80 border-mercurio-blue shadow-lg shadow-mercurio-blue/10' 
                                                : 'bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-slate-900/60'
                                        }`}
                                    >
                                        {/* Luz decorativa cuando está seleccionada */}
                                        {isSelected && (
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-mercurio-blue/20 to-transparent rounded-bl-full pointer-events-none"></div>
                                        )}

                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-mercurio-blue transition-colors mb-2">
                                                {sucursal.nombre}
                                            </h3>
                                            <div className="space-y-2 text-sm text-slate-400">
                                                <div className="flex items-start gap-2.5">
                                                    <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-mercurio-blue' : 'text-slate-500'}`} />
                                                    <span>{sucursal.direccion}</span>
                                                </div>
                                                
                                                {sucursal.telefono && (
                                                    <div className="flex items-center gap-2.5">
                                                        <Phone className={`w-4 h-4 shrink-0 ${isSelected ? 'text-mercurio-pink' : 'text-slate-500'}`} />
                                                        <a href={`tel:${sucursal.telefono.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                                                            {sucursal.telefono}
                                                        </a>
                                                    </div>
                                                )}

                                                {sucursal.horarios && (
                                                    <div className="flex items-start gap-2.5">
                                                        <Clock className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-mercurio-yellow' : 'text-slate-500'}`} />
                                                        <span>{sucursal.horarios}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Botones de acción rápidos */}
                                        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                                            <a 
                                                href={getExternalMapUrl(sucursal)} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-mercurio-blue hover:text-white transition-colors"
                                                onClick={(e) => e.stopPropagation()} // Evitar seleccionar tarjeta de nuevo
                                            >
                                                <Navigation className="w-3.5 h-3.5" />
                                                Cómo llegar
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                            {sucursal.telefono && (
                                                <a 
                                                    href={`tel:${sucursal.telefono.replace(/\s+/g, '')}`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors ml-auto"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Llamar
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Columna Derecha: Mapa Interactivo */}
                        <div className="lg:col-span-7 flex flex-col h-[500px] lg:h-auto min-h-[400px]">
                            <div className="flex-1 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl">
                                <AnimatePresence mode="wait">
                                    {selectedSucursal && (
                                        <motion.div
                                            key={selectedSucursal.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0 w-full h-full"
                                        >
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                className="border-0 absolute inset-0 filter invert opacity-80 contrast-125"
                                                loading="lazy"
                                                allowFullScreen
                                                title={`Mapa de sucursal ${selectedSucursal.nombre}`}
                                                src={getMapUrl(selectedSucursal)}
                                            ></iframe>
                                            
                                            {/* Etiqueta de Sucursal seleccionada sobre el mapa (Estilo Glassmorphism Premium) */}
                                            <div className="absolute bottom-6 left-6 right-6 p-4 glass bg-slate-950/75 border border-white/10 rounded-2xl flex items-center justify-between pointer-events-auto shadow-2xl backdrop-blur-md">
                                                <div>
                                                    <h4 className="text-sm font-black text-white">{selectedSucursal.nombre}</h4>
                                                    <p className="text-xs text-slate-400 mt-0.5">{selectedSucursal.direccion}</p>
                                                </div>
                                                <a 
                                                    href={getExternalMapUrl(selectedSucursal)} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="p-3 bg-gradient-to-r from-mercurio-blue to-mercurio-pink hover:from-mercurio-blue/90 hover:to-mercurio-pink/90 text-white rounded-xl shadow-lg transition-all"
                                                >
                                                    <Navigation className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-4 glass border border-white/5 rounded-3xl max-w-xl mx-auto">
                        <Map className="text-slate-600 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-white mb-1">No hay sucursales registradas</h3>
                        <p className="text-sm text-slate-400 max-w-sm">
                            Actualmente no tenemos sucursales cargadas. Por favor, vuelve a consultar más tarde.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
