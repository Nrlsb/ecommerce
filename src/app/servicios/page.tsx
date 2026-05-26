'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Truck, 
    Headphones, 
    ShieldCheck, 
    Award, 
    Palette, 
    ArrowLeft, 
    CheckCircle2, 
    MapPin, 
    Mail, 
    Phone, 
    ArrowRight, 
    Sparkles, 
    Layers,
    HeartHandshake,
    Calendar,
    Clock,
    BadgeCheck
} from 'lucide-react';
import Link from 'next/link';

// Datos de los Servicios
const SERVICES_DATA = [
    {
        id: 'envios',
        title: 'Envíos a Todo el País',
        shortDesc: 'Para su comodidad, realizamos envíos a todo el país en el menor tiempo posible.',
        longDesc: 'Contamos con una red logística integrada por transportes líderes para garantizar que tu pedido llegue en perfectas condiciones y a tiempo. Realizamos envíos de forma diaria con seguimiento en tiempo real.',
        icon: Truck,
        color: 'mercurio-blue',
        accentColor: '#1E3773',
        bgGradient: 'from-blue-500/10 to-indigo-500/10',
        badge: 'Logística Express'
    },
    {
        id: 'atencion',
        title: 'Atención Personalizada',
        shortDesc: 'En nuestras sucursales y medios de comunicación digital, encontrará asesores idóneos, capacitados y actualizados.',
        longDesc: 'Nuestro equipo técnico recibe capacitación constante sobre nuevos productos, técnicas de aplicación y tendencias de color. Ya sea en persona, por teléfono o canales digitales, te brindamos la asesoría profesional que tu proyecto merece.',
        icon: Headphones,
        color: 'mercurio-pink',
        accentColor: '#EB2891',
        bgGradient: 'from-pink-500/10 to-rose-500/10',
        badge: 'Soporte Técnico'
    },
    {
        id: 'experiencia',
        title: 'Experiencia y Garantía',
        shortDesc: 'Con más de 40 años de experiencia, brindamos la seguridad de productos líderes y asesoramiento correcto.',
        longDesc: 'Nuestra trayectoria de cuatro décadas en el mercado nos consolida como referentes indiscutidos del sector. Trabajamos exclusivamente con marcas oficiales y productos originales con certificación y garantía de fábrica.',
        icon: ShieldCheck,
        color: 'mercurio-yellow',
        accentColor: '#FFCD28',
        bgGradient: 'from-yellow-500/10 to-amber-500/10',
        badge: 'Garantía Oficial'
    },
    {
        id: 'marcas',
        title: 'Variedad de Marcas',
        shortDesc: 'Ponemos a su disposición una amplia gama de marcas, apuntando a satisfacer sus necesidades acorde a su presupuesto.',
        longDesc: 'Seleccionamos cuidadosamente nuestro catálogo para ofrecerte desde las marcas líderes del mercado hasta opciones con excelente relación calidad-precio. Todo en un solo lugar y al mejor precio garantizado.',
        icon: Layers,
        color: 'mercurio-green',
        accentColor: '#AACD46',
        bgGradient: 'from-green-500/10 to-emerald-500/10',
        badge: 'Catálogo Premium'
    },
    {
        id: 'colores',
        title: 'Preparación de Colores',
        shortDesc: 'Gracias a nuestros modernos equipos y tecnología de punta, preparamos en el acto el color de su preferencia.',
        longDesc: 'Con nuestro sistema tintométrico computarizado de alta precisión, podemos recrear más de 10.000 tonalidades diferentes en cuestión de minutos. Traé tu muestra o elegí de nuestras cartas de colores y lo preparamos al instante.',
        icon: Palette,
        color: 'mercurio-pink',
        accentColor: '#EB2891',
        bgGradient: 'from-purple-500/10 to-pink-500/10',
        badge: 'Sistema Tintométrico'
    }
];

// Provincias para el simulador de envíos
const PROVINCES_SHIPPING = [
    { name: 'Buenos Aires (CABA y GBA)', cost: 'Gratis en compras > $80.000 / Retiro gratis en sucursal', time: '24 a 48 hs hábiles' },
    { name: 'Buenos Aires (Interior)', cost: 'Envíos por Correo Argentino / Expreso', time: '3 a 5 días hábiles' },
    { name: 'Santa Fe (Esperanza / Rosario / Santa Fe Cap.)', cost: 'Gratis en compras > $50.000 / Retiro gratis en sucursal', time: '24 hs hábiles' },
    { name: 'Santa Fe (Resto de la provincia)', cost: 'Envíos por Correo Argentino / Expreso local', time: '48 a 72 hs hábiles' },
    { name: 'Córdoba', cost: 'Expreso / Correo Argentino a domicilio', time: '3 a 5 días hábiles' },
    { name: 'Entre Ríos', cost: 'Expreso / Correo Argentino a domicilio', time: '3 a 4 días hábiles' },
    { name: 'Resto del País (Excepto Salta y Tierra del Fuego)', cost: 'Correo Argentino / Expresos seleccionados', time: '5 a 8 días hábiles' }
];

// Marcas destacadas
const BRANDS_DATA = [
    { name: 'Alba', desc: 'Pinturas Látex e Impermeabilizantes Premium. Líder mundial en color.', color: 'border-blue-500/30 text-blue-600' },
    { name: 'Sherwin-Williams', desc: 'Revestimientos de alta tecnología, esmaltes y línea automotor.', color: 'border-cyan-500/30 text-cyan-600' },
    { name: 'Sinteplast', desc: 'Amplia línea de pinturas para hogar, obra, industria y automotor.', color: 'border-orange-500/30 text-orange-600' },
    { name: 'Tersuave', desc: 'Tradición y calidad superior en látex, barnices y esmaltes.', color: 'border-red-500/30 text-red-600' },
    { name: 'Plavicon', desc: 'Especialistas absolutos en impermeabilizantes y selladores.', color: 'border-sky-500/30 text-sky-600' },
    { name: 'Rust-Oleum', desc: 'Aerosoles técnicos y pinturas de especialidad de renombre mundial.', color: 'border-neutral-500/30 text-neutral-700' }
];

// Colores del Simulador de Mezclado
const COLOR_MIXER_PALETTE = [
    { name: 'Azul Mercurio', hex: '#1E3773', class: 'bg-[#1E3773]' },
    { name: 'Rosa Mercurio', hex: '#EB2891', class: 'bg-[#EB2891]' },
    { name: 'Amarillo Mercurio', hex: '#FFCD28', class: 'bg-[#FFCD28]' },
    { name: 'Verde Mercurio', hex: '#AACD46', class: 'bg-[#AACD46]' },
    { name: 'Blanco Puro', hex: '#FFFFFF', class: 'bg-white border border-slate-200' },
    { name: 'Rojo Carmín', hex: '#DC2626', class: 'bg-red-600' },
    { name: 'Celeste Cielo', hex: '#38BDF8', class: 'bg-sky-400' },
    { name: 'Gris Grafito', hex: '#4B5563', class: 'bg-gray-600' },
];

export default function ServiciosPage() {
    const [selectedService, setSelectedService] = useState('envios');
    
    // Estados para el Simulador de Envíos
    const [shippingProvince, setShippingProvince] = useState('');
    
    // Estados para el Simulador de Preparación de Colores
    const [mixBase, setMixBase] = useState('Látex Interior Premium');
    const [mixColor, setMixColor] = useState(COLOR_MIXER_PALETTE[1]); // Rosa Mercurio por defecto
    const [mixIntensity, setMixIntensity] = useState(50); // Porcentaje de intensidad
    const [isMixing, setIsMixing] = useState(false);
    const [mixDone, setMixDone] = useState(false);

    // Manejador para el simulador de mezcla
    const handleMixColor = () => {
        setIsMixing(true);
        setMixDone(false);
        setTimeout(() => {
            setIsMixing(false);
            setMixDone(true);
        }, 2200);
    };

    // Función auxiliar para aclarar/oscurecer colores en base a intensidad para la visualización digital
    const getAdjustedColor = () => {
        if (mixColor.hex === '#FFFFFF') {
            // Si es blanco, ajustar a gris claro según intensidad
            const val = Math.round(255 - (mixIntensity * 0.5));
            return `rgb(${val}, ${val}, ${val})`;
        }
        
        // Convertir hex a rgb para calcular intensidad
        const hex = mixColor.hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // Mezclar con blanco (255, 255, 255) en base a la intensidad
        // Si intensidad es 100%, el color es pleno. Si es 0%, es casi blanco.
        const factor = mixIntensity / 100;
        const finalR = Math.round(255 - (255 - r) * factor);
        const finalG = Math.round(255 - (255 - g) * factor);
        const finalB = Math.round(255 - (255 - b) * factor);
        
        return `rgb(${finalR}, ${finalG}, ${finalB})`;
    };

    const activeServiceData = SERVICES_DATA.find(s => s.id === selectedService) || SERVICES_DATA[0];

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 font-sans antialiased pb-20">
            
            {/* Header premium con gradiente decorativo */}
            <div className="relative overflow-hidden py-16 md:py-24 bg-slate-900 border-b border-white/5">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-mercurio-blue via-mercurio-pink to-mercurio-yellow"></div>
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-tr from-mercurio-blue/15 to-mercurio-pink/15 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
                <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-gradient-to-tr from-mercurio-yellow/5 to-mercurio-green/5 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white mb-4 text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:-translate-x-1">
                                <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
                            </Link>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-mercurio-yellow mb-4">
                                <Sparkles className="w-3.5 h-3.5 text-mercurio-yellow" />
                                Servicios Profesionales
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase font-display">
                                Nuestros Servicios
                            </h1>
                            <p className="text-slate-400 text-sm md:text-base font-light mt-3 max-w-2xl leading-relaxed">
                                En Pinturerías Mercurio te ofrecemos soluciones integrales para tus proyectos de pintura y remodelación. Calidad, garantía y tecnología a tu disposición.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenedor Principal */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Selector de Servicios en columna izquierda (Desktop) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2 mb-2">
                            Seleccione un servicio
                        </div>
                        <div className="space-y-3">
                            {SERVICES_DATA.map((service) => {
                                const Icon = service.icon;
                                const isSelected = selectedService === service.id;
                                return (
                                    <button
                                        key={service.id}
                                        onClick={() => setSelectedService(service.id)}
                                        className={`w-full text-left p-4 rounded-3xl border transition-all duration-300 flex items-start gap-4 group cursor-pointer relative overflow-hidden ${
                                            isSelected
                                                ? 'bg-slate-900 border-slate-900 dark:bg-white dark:border-white text-white dark:text-slate-900 shadow-xl shadow-slate-950/10'
                                                : 'bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/90'
                                        }`}
                                    >
                                        <div className={`p-3 rounded-2xl transition-all duration-300 ${
                                            isSelected 
                                                ? 'bg-white/10 dark:bg-slate-900/5 text-white dark:text-slate-900' 
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:scale-110'
                                        }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-extrabold text-sm uppercase tracking-wide">
                                                    {service.title}
                                                </span>
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                                    isSelected
                                                        ? 'bg-white/20 border-white/20 text-white dark:bg-slate-900/10 dark:border-slate-900/10 dark:text-slate-900'
                                                        : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800/80 dark:border-white/5 dark:text-slate-400'
                                                }`}>
                                                    {service.badge}
                                                </span>
                                            </div>
                                            <p className={`text-xs font-light line-clamp-2 leading-relaxed ${
                                                isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400 dark:text-slate-400'
                                            }`}>
                                                {service.shortDesc}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Detalle interactivo del servicio (Columna derecha) */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedService}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-premium relative overflow-hidden group min-h-[500px] flex flex-col justify-between"
                            >
                                {/* Fondo decorativo sutil con gradiente */}
                                <div className={`absolute right-0 top-0 w-80 h-80 bg-gradient-to-br ${activeServiceData.bgGradient} rounded-full blur-3xl opacity-30 pointer-events-none group-hover:opacity-40 transition-opacity`}></div>
                                
                                <div className="space-y-6 relative z-10">
                                    {/* Cabecera del Detalle */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300`}>
                                                {activeServiceData.badge}
                                            </span>
                                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                {activeServiceData.title}
                                            </h2>
                                        </div>
                                        <div className={`p-4 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white`}>
                                            {(() => {
                                                const Icon = activeServiceData.icon;
                                                return <Icon className="w-8 h-8" />;
                                            })()}
                                        </div>
                                    </div>

                                    {/* Descripción Larga */}
                                    <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base font-light leading-relaxed">
                                        {activeServiceData.longDesc}
                                    </p>

                                    {/* Módulos Interactivos por Servicio */}
                                    <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                                        
                                        {/* INTERACTIVIDAD 1: ENVÍOS */}
                                        {selectedService === 'envios' && (
                                            <div className="space-y-4">
                                                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                                    Simulador de Tiempos y Costos de Envío
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-slate-500">Seleccione su Provincia / Zona:</label>
                                                        <select
                                                            value={shippingProvince}
                                                            onChange={(e) => setShippingProvince(e.target.value)}
                                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:border-mercurio-blue focus:ring-1 focus:ring-mercurio-blue transition-all font-medium"
                                                        >
                                                            <option value="">-- Seleccionar Zona --</option>
                                                            {PROVINCES_SHIPPING.map((prov, i) => (
                                                                <option key={i} value={prov.name}>{prov.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <AnimatePresence mode="wait">
                                                        {shippingProvince ? (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.95 }}
                                                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 space-y-2"
                                                            >
                                                                {(() => {
                                                                    const details = PROVINCES_SHIPPING.find(p => p.name === shippingProvince);
                                                                    return details ? (
                                                                        <>
                                                                            <div>
                                                                                <span className="block text-[10px] uppercase font-bold text-slate-400">Plazo de entrega estimado</span>
                                                                                <span className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5 mt-0.5">
                                                                                    <Clock className="w-4 h-4 text-mercurio-blue" />
                                                                                    {details.time}
                                                                                </span>
                                                                            </div>
                                                                            <div className="pt-2 border-t border-slate-200/50 dark:border-white/5">
                                                                                <span className="block text-[10px] uppercase font-bold text-slate-400">Condición / Costo</span>
                                                                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5 block">
                                                                                    {details.cost}
                                                                                </span>
                                                                            </div>
                                                                        </>
                                                                    ) : null;
                                                                })()}
                                                            </motion.div>
                                                        ) : (
                                                            <div className="flex items-center justify-center p-4 border border-dashed border-slate-200 dark:border-white/5 rounded-2xl text-slate-400 dark:text-slate-500 text-xs text-center">
                                                                Seleccione su ubicación para calcular los plazos de entrega estimados de la mercadería.
                                                            </div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div className="bg-blue-50/50 dark:bg-slate-950/40 p-4 rounded-2xl border border-blue-100/50 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5 leading-relaxed">
                                                    <BadgeCheck className="w-4.5 h-4.5 text-mercurio-blue flex-shrink-0 mt-0.5" />
                                                    <span>
                                                        <strong>Nota importante:</strong> Los envíos se realizan los días hábiles. En caso de no retirar el producto detallado en la factura en un punto de venta, dispone de 10 días hábiles. Quedan excluidos los envíos al exterior, Antártida, Islas del Atlántico Sur y la provincia de Salta.
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* INTERACTIVIDAD 2: ATENCIÓN PERSONALIZADA */}
                                        {selectedService === 'atencion' && (
                                            <div className="space-y-4">
                                                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                                    Canales de Asesoramiento Técnico Directo
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <a 
                                                        href="https://wa.me/5491122334455" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900/60 transition-all flex items-center gap-3.5 group/btn"
                                                    >
                                                        <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500 group-hover/btn:bg-green-500 group-hover/btn:text-white transition-all">
                                                            <Phone className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <span className="block text-[10px] uppercase font-bold text-slate-400">WhatsApp Técnico</span>
                                                            <span className="text-sm font-bold text-slate-800 dark:text-white">+54 9 11 2233-4455</span>
                                                        </div>
                                                    </a>
                                                    <a 
                                                        href="mailto:consultas@pintureriamercurio.com.ar"
                                                        className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900/60 transition-all flex items-center gap-3.5 group/btn"
                                                    >
                                                        <div className="p-2.5 rounded-xl bg-mercurio-pink/10 text-mercurio-pink group-hover/btn:bg-mercurio-pink group-hover/btn:text-white transition-all">
                                                            <Mail className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <span className="block text-[10px] uppercase font-bold text-slate-400">Email de Consultas</span>
                                                            <span className="text-xs font-bold text-slate-800 dark:text-white truncate block max-w-[180px]">consultas@pintureriamercurio.com.ar</span>
                                                        </div>
                                                    </a>
                                                </div>
                                                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                    <div className="space-y-1 text-center sm:text-left">
                                                        <span className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wide block">¿Preferís visitarnos en persona?</span>
                                                        <span className="text-xs text-slate-400 font-light block">Encontrá tu sucursal más cercana con horarios y mapas.</span>
                                                    </div>
                                                    <Link href="/sucursales" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl text-xs font-bold transition-all hover:scale-105">
                                                        <MapPin className="w-3.5 h-3.5" /> Ver Sucursales
                                                    </Link>
                                                </div>
                                            </div>
                                        )}

                                        {/* INTERACTIVIDAD 3: EXPERIENCIA Y GARANTÍA */}
                                        {selectedService === 'experiencia' && (
                                            <div className="space-y-4">
                                                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                                    Nuestros Compromisos de Calidad y Confianza
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 space-y-2 text-center sm:text-left">
                                                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center mx-auto sm:mx-0">
                                                            <Calendar className="w-4 h-4" />
                                                        </div>
                                                        <span className="block text-xl font-black text-slate-800 dark:text-white">+40 Años</span>
                                                        <span className="block text-[10px] text-slate-400 uppercase font-bold leading-relaxed">
                                                            De trayectoria ininterrumpida en el país.
                                                        </span>
                                                    </div>

                                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 space-y-2 text-center sm:text-left">
                                                        <div className="w-8 h-8 rounded-lg bg-mercurio-pink/10 text-mercurio-pink flex-center items-center justify-center mx-auto sm:mx-0">
                                                            <Award className="w-4 h-4" />
                                                        </div>
                                                        <span className="block text-xl font-black text-slate-800 dark:text-white">100% Original</span>
                                                        <span className="block text-[10px] text-slate-400 uppercase font-bold leading-relaxed">
                                                            Garantía oficial y directa del fabricante.
                                                        </span>
                                                    </div>

                                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 space-y-2 text-center sm:text-left">
                                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center mx-auto sm:mx-0">
                                                            <HeartHandshake className="w-4 h-4" />
                                                        </div>
                                                        <span className="block text-xl font-black text-slate-800 dark:text-white">Garantía Total</span>
                                                        <span className="block text-[10px] text-slate-400 uppercase font-bold leading-relaxed">
                                                            10 días de cambio (excepto color preparado).
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* INTERACTIVIDAD 4: VARIEDAD DE MARCAS */}
                                        {selectedService === 'marcas' && (
                                            <div className="space-y-4">
                                                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                                    Nuestras Marcas Asociadas
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {BRANDS_DATA.map((brand, i) => (
                                                        <div 
                                                            key={i}
                                                            className={`p-3.5 rounded-2xl border bg-slate-50 dark:bg-slate-950 border-slate-200/70 dark:border-white/5 space-y-1 hover:border-slate-300 dark:hover:border-white/10 transition-colors`}
                                                        >
                                                            <span className="block text-sm font-black text-slate-800 dark:text-white tracking-wide">
                                                                {brand.name}
                                                            </span>
                                                            <span className="block text-[9px] text-slate-400 font-light leading-relaxed">
                                                                {brand.desc}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* INTERACTIVIDAD 5: PREPARACIÓN DE COLORES */}
                                        {selectedService === 'colores' && (
                                            <div className="space-y-5">
                                                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                                    Simulador Digital de Sistema Tintométrico
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-950 p-5 rounded-3xl border border-slate-200/50 dark:border-white/5">
                                                    
                                                    {/* Panel de Controles */}
                                                    <div className="space-y-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] uppercase font-bold text-slate-400">1. Tipo de Base de Pintura:</label>
                                                            <select
                                                                value={mixBase}
                                                                onChange={(e) => setMixBase(e.target.value)}
                                                                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-mercurio-pink"
                                                            >
                                                                <option value="Látex Interior Premium">Látex Interior Premium</option>
                                                                <option value="Látex Exterior Acrílico">Látex Exterior Acrílico</option>
                                                                <option value="Esmalte Sintético Satinado">Esmalte Sintético Satinado</option>
                                                                <option value="Pintura para Pisos Deportivos">Pintura para Pisos Deportivos</option>
                                                            </select>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] uppercase font-bold text-slate-400">2. Tonalidad a Preparar:</label>
                                                            <div className="grid grid-cols-4 gap-2">
                                                                {COLOR_MIXER_PALETTE.map((color, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={() => {
                                                                            setMixColor(color);
                                                                            setMixDone(false);
                                                                        }}
                                                                        className={`h-7 rounded-lg transition-transform ${color.class} ${
                                                                            mixColor.name === color.name 
                                                                                ? 'ring-2 ring-mercurio-pink ring-offset-2 dark:ring-offset-slate-950 scale-105' 
                                                                                : 'hover:scale-105'
                                                                        }`}
                                                                        title={color.name}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-[10px] text-slate-400 block mt-1 font-medium">
                                                                Seleccionado: <strong className="text-slate-600 dark:text-slate-300">{mixColor.name}</strong>
                                                            </span>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
                                                                <span>3. Intensidad del Color:</span>
                                                                <span className="text-slate-700 dark:text-slate-300 font-extrabold">{mixIntensity}%</span>
                                                            </div>
                                                            <input 
                                                                type="range" 
                                                                min="10" 
                                                                max="100" 
                                                                value={mixIntensity} 
                                                                onChange={(e) => {
                                                                    setMixIntensity(Number(e.target.value));
                                                                    setMixDone(false);
                                                                }}
                                                                className="w-full accent-mercurio-pink bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                                                            />
                                                        </div>

                                                        <button
                                                            onClick={handleMixColor}
                                                            disabled={isMixing}
                                                            className="w-full py-3 bg-gradient-to-r from-mercurio-blue to-mercurio-pink text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02] shadow-md disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                                                        >
                                                            {isMixing ? 'Preparando Mezcla...' : 'Iniciar Preparación Digital'}
                                                        </button>
                                                    </div>

                                                    {/* Vista previa visual */}
                                                    <div className="flex flex-col items-center justify-center border border-slate-200/50 dark:border-white/5 rounded-2xl bg-white dark:bg-slate-900 p-4 min-h-[180px] relative overflow-hidden">
                                                        <div className="w-16 h-20 border-2 border-slate-300 dark:border-slate-600 rounded-b-xl rounded-t-sm relative flex flex-col justify-end overflow-hidden bg-slate-50 dark:bg-slate-950">
                                                            {/* Tapa de lata */}
                                                            <div className="absolute top-0 left-0 w-full h-1 bg-slate-400 dark:bg-slate-500"></div>
                                                            {/* Líquido */}
                                                            <motion.div 
                                                                animate={isMixing ? {
                                                                    height: ['0%', '80%', '80%'],
                                                                    backgroundColor: ['#FFFFFF', mixColor.hex, getAdjustedColor()]
                                                                } : mixDone ? {
                                                                    height: '80%',
                                                                    backgroundColor: getAdjustedColor()
                                                                } : {
                                                                    height: '15%',
                                                                    backgroundColor: '#f1f5f9'
                                                                }}
                                                                transition={{ duration: 2.2, ease: "easeInOut" }}
                                                                className="w-full"
                                                                style={{ backgroundColor: mixDone ? getAdjustedColor() : '#f1f5f9' }}
                                                            />
                                                            {/* Efecto de batido */}
                                                            {isMixing && (
                                                                <motion.div 
                                                                    animate={{
                                                                        y: [0, -4, 4, -2, 2, 0],
                                                                        rotate: [0, -2, 2, -1, 1, 0]
                                                                    }}
                                                                    transition={{ duration: 0.5, repeat: 4 }}
                                                                    className="absolute inset-0 bg-transparent pointer-events-none"
                                                                />
                                                            )}
                                                        </div>

                                                        {/* Estado de la lata */}
                                                        <div className="mt-4 text-center space-y-1 z-10">
                                                            {isMixing ? (
                                                                <span className="text-[11px] font-bold text-mercurio-pink animate-pulse block">Batidor e Inyección activados...</span>
                                                            ) : mixDone ? (
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    className="space-y-1"
                                                                >
                                                                    <span className="text-[11px] font-black text-green-500 flex items-center justify-center gap-1">
                                                                        <CheckCircle2 className="w-3.5 h-3.5" /> ¡Color Listo en Sucursal!
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400 block font-light leading-snug">
                                                                        Base: {mixBase} <br />
                                                                        Color: {mixColor.name} ({mixIntensity}%)
                                                                    </span>
                                                                </motion.div>
                                                            ) : (
                                                                <span className="text-[10px] text-slate-400 font-light block">Lata base lista para dosificación.</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>

                                {/* Botón de CTA o contacto específico */}
                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
                                    <span className="text-xs text-slate-400 font-light">
                                        ¿Tenés dudas técnicas sobre este servicio? Consultá de manera directa.
                                    </span>
                                    <Link 
                                        href="/contacto" 
                                        className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-wider rounded-xl transition-all hover:scale-105 cursor-pointer"
                                    >
                                        Escribinos
                                        <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                                    </Link>
                                </div>

                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>

            {/* Sección inferior: Por qué elegirnos */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-24">
                <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden text-center space-y-8">
                    {/* Elementos de fondo */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-mercurio-blue/10 to-mercurio-pink/10 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-mercurio-yellow/5 to-mercurio-green/5 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
                    
                    <div className="max-w-2xl mx-auto space-y-3 relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-mercurio-pink">
                            <Sparkles className="w-3.5 h-3.5 text-mercurio-pink" />
                            Garantía Mercurio
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-display">
                            ¿Por qué elegir Pinturerías Mercurio?
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base font-light leading-relaxed">
                            Desde hace más de 40 años ayudamos a nuestros clientes a transformar sus hogares, comercios e industrias con los mejores materiales de recubrimiento y un asesoramiento insuperable.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 relative z-10">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-mercurio-blue/20 text-mercurio-blue flex items-center justify-center mx-auto">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Productos Genuinos</h4>
                            <p className="text-slate-400 text-xs font-light leading-relaxed">Solo vendemos productos directo de fábrica de las marcas líderes oficiales.</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-mercurio-pink/20 text-mercurio-pink flex items-center justify-center mx-auto">
                                <Truck className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Envíos Seguros</h4>
                            <p className="text-slate-400 text-xs font-light leading-relaxed">Embalaje reforzado y transporte verificado para evitar derrames o roturas.</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-mercurio-yellow/20 text-mercurio-yellow flex items-center justify-center mx-auto">
                                <Headphones className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Soporte Técnico</h4>
                            <p className="text-slate-400 text-xs font-light leading-relaxed">Asesores capacitados disponibles para evacuar cualquier consulta técnica de obra.</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-mercurio-green/20 text-mercurio-green flex items-center justify-center mx-auto">
                                <Palette className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Exactitud de Color</h4>
                            <p className="text-slate-400 text-xs font-light leading-relaxed">Tecnología de dosificación por peso y espectrofotómetros de última generación.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
