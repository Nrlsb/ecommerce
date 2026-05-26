'use client';

import { motion, Variants } from 'framer-motion';
import { 
    ArrowLeft, 
    Target, 
    Sparkles, 
    Users, 
    Heart, 
    Ear, 
    ShieldCheck, 
    MapPin, 
    Calendar, 
    Award, 
    Building2,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SobreMercurioPage() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                type: 'spring', 
                stiffness: 80, 
                damping: 15 
            } 
        }
    };

    const stats = [
        { number: '1980', label: 'Año de Fundación', icon: Calendar, color: 'text-mercurio-blue bg-mercurio-blue/10' },
        { number: '40+', label: 'Años de Trayectoria', icon: Award, color: 'text-mercurio-pink bg-mercurio-pink/10' },
        { number: '18', label: 'Sucursales Activas', icon: MapPin, color: 'text-mercurio-yellow bg-mercurio-yellow/10' },
        { number: '3', label: 'Ciudades de la Región', icon: Building2, color: 'text-mercurio-green bg-mercurio-green/10' }
    ];

    const timelineItems = [
        {
            year: '1980',
            title: 'Los Cimientos: La Casa del Pintor',
            place: 'Esperanza, Santa Fe',
            description: 'Pinturerías Mercurio nació en la ciudad de Esperanza, en ese entonces una pequeña localidad donde no existía aún un negocio dedicado exclusivamente a este rubro. Con el tesón que requiere todo emprendimiento de estas características, se comenzaron a forjar los cimientos de lo que sería una empresa en constante crecimiento.',
            highlight: 'Primer local especializado de la localidad.'
        },
        {
            year: 'Expansión',
            title: 'Crecimiento en el Interior',
            place: 'Localidades Provinciales',
            description: 'Bajo el nombre de La Casa del Pintor, se fundó el primer local y, al tiempo, sucesivas sucursales en distintas localidades del interior provincial. A partir de la experiencia lograda, se decidió la expansión de la empresa hacia la capital provincial, Santa Fe, con los desafíos que ello implicaba.',
            highlight: 'Ganando experiencia en mercados del interior.'
        },
        {
            year: 'Consolidación',
            title: 'El Nacimiento de Pinturerías Mercurio',
            place: 'Santa Fe y Santo Tomé',
            description: 'Con el enorme esfuerzo de toda Pyme familiar, se inauguraron las actuales sucursales de Santa Fe y Santo Tomé, ya bajo la marca consolidada de Pinturerías Mercurio, estableciendo una propuesta de valor enfocada en el servicio y la calidad.',
            highlight: 'Desembarco estratégico en las principales urbes de la provincia.'
        },
        {
            year: 'Hoy',
            title: 'Segunda Generación y Liderazgo Regional',
            place: '18 Puntos Estratégicos',
            description: 'Hoy, con más de 40 años de trayectoria, somos una empresa de segunda generación. Nuestra red cuenta con 18 sucursales ubicadas estratégicamente en las ciudades de Santa Fe, Santo Tomé y Esperanza, complementando la sinergia comercial con la Distribuidora Espint, comercializando las más reconocidas marcas en toda la región.',
            highlight: 'Líderes regionales junto a Distribuidora Espint.'
        }
    ];

    const values = [
        {
            name: 'Trabajo Grupal',
            description: 'Creemos en la fuerza de la colaboración. La sinergia y el esfuerzo conjunto de nuestro equipo humano son el motor de nuestra constante evolución.',
            icon: Users,
            borderColor: 'group-hover:border-mercurio-blue/30',
            iconColor: 'text-mercurio-blue bg-mercurio-blue/10'
        },
        {
            name: 'Transparencia',
            description: 'Actuamos con total honestidad y claridad en cada interacción, construyendo una relación de confianza indisoluble con nuestros clientes y proveedores.',
            icon: ShieldCheck,
            borderColor: 'group-hover:border-mercurio-green/30',
            iconColor: 'text-mercurio-green bg-mercurio-green/10'
        },
        {
            name: 'Amabilidad',
            description: 'Brindamos un trato cálido y humano. Nos esforzamos para que cada persona que ingrese a nuestras sucursales se sienta bienvenida y valorada.',
            icon: Heart,
            borderColor: 'group-hover:border-mercurio-pink/30',
            iconColor: 'text-mercurio-pink bg-mercurio-pink/10'
        },
        {
            name: 'Saber Escuchar',
            description: 'Prestamos atención dedicada a las necesidades individuales para ofrecer recomendaciones técnicas y estéticas precisas y satisfactorias.',
            icon: Ear,
            borderColor: 'group-hover:border-mercurio-yellow/30',
            iconColor: 'text-mercurio-yellow bg-mercurio-yellow/10'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 font-sans antialiased pb-24">
            
            {/* Header / Hero Section */}
            <div className="relative overflow-hidden py-24 bg-[#020617] border-b border-white/5">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-mercurio-blue via-mercurio-pink to-mercurio-yellow"></div>
                
                {/* Background Glows */}
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-tr from-mercurio-blue/10 to-mercurio-pink/10 rounded-full blur-3xl opacity-55 pointer-events-none"></div>
                <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-gradient-to-tr from-mercurio-yellow/5 to-mercurio-pink/5 rounded-full blur-3xl opacity-35 pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white mb-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300">
                        <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
                    </Link>
                    
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black bg-white/5 border border-white/10 text-mercurio-yellow uppercase tracking-widest">
                        Nuestra Trayectoria
                    </span>
                    
                    <h1 className="text-4.5xl md:text-6xl font-black text-white tracking-tight uppercase font-display bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Sobre Nosotros
                    </h1>
                    
                    <p className="text-slate-400 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
                        Conocé la historia, el propósito y los valores de Pinturerías Mercurio, una empresa familiar que crece junto a vos desde hace más de 40 años.
                    </p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
                
                {/* Stats Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                >
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div 
                                key={i}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="glass bg-white dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-premium flex flex-col justify-between group"
                            >
                                <div className="flex justify-between items-start">
                                    <span className="text-3xl md:text-4.5xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {stat.number}
                                    </span>
                                    <div className={`p-2.5 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                </div>
                                <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-light mt-4">
                                    {stat.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Historia Section */}
                <div className="mt-24 space-y-16">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <span className="text-[10px] font-black tracking-widest text-mercurio-pink uppercase">Desde 1980</span>
                        <h2 className="text-3xl md:text-4.5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            Nuestra Historia
                        </h2>
                        <div className="w-12 h-1 bg-mercurio-pink mx-auto rounded-full"></div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                            Forjados con el esfuerzo de una familia y el compromiso inquebrantable con nuestra comunidad.
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="relative border-l-2 border-slate-200/60 dark:border-white/5 ml-4 md:ml-0 md:left-1/2 md:-translate-x-[1px] space-y-12 pb-8">
                        {timelineItems.map((item, idx) => (
                            <div key={idx} className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center w-full">
                                
                                {/* Point Indicator */}
                                <div className="absolute -left-[9px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 dark:bg-white border-4 border-slate-100 dark:border-slate-950 z-30 shadow-md"></div>
                                
                                {/* Timeline Card */}
                                <div className={`w-full md:w-[45%] pl-6 md:pl-0 ${idx % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto md:order-last'}`}>
                                    <motion.div 
                                        initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                        className="glass bg-white dark:bg-slate-900/40 p-6 md:p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/5 shadow-sm space-y-4 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="px-3 py-1 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-black rounded-full tracking-wider">
                                                {item.year}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-mercurio-pink" /> {item.place}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white group-hover:text-mercurio-blue transition-colors">
                                            {item.title}
                                        </h3>
                                        
                                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                                            {item.description}
                                        </p>
                                        
                                        <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 text-[11px] font-bold text-mercurio-blue dark:text-mercurio-yellow">
                                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span>{item.highlight}</span>
                                        </div>
                                    </motion.div>
                                </div>
                                
                                {/* Spacer for large screens */}
                                <div className="hidden md:block w-[45%]"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Misión y Visión Section */}
                <div className="mt-28 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Misión Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="md:col-span-7 glass bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900/40 dark:to-slate-950/20 p-8 md:p-10 rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 shadow-premium flex flex-col justify-between relative overflow-hidden group"
                    >
                        <div className="absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-tr from-mercurio-blue/10 to-mercurio-pink/10 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="inline-flex p-3.5 bg-mercurio-blue/10 rounded-2.5xl text-mercurio-blue">
                                <Target className="w-7 h-7" />
                            </div>
                            <span className="block text-[10px] font-black tracking-widest text-mercurio-blue uppercase">Nuestra Misión</span>
                            <h3 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                Brindar Confianza y Soluciones
                            </h3>
                            <p className="text-sm md:text-base text-slate-600 dark:text-slate-350 font-light leading-relaxed">
                                Nuestra misión es consolidarnos como la cadena de pinturerías de mayor confiabilidad para el cliente, tanto hogareño como profesional, conformando un grupo humano capaz de brindar las soluciones necesarias a través de un asesoramiento profesionalizado y generando para con ellos relaciones duraderas a través de los años.
                            </p>
                        </div>
                    </motion.div>

                    {/* Logo & Brand Identity Panel */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="md:col-span-5 glass bg-slate-950/80 p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-premium flex flex-col justify-between relative overflow-hidden text-white"
                    >
                        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-mercurio-pink/10 rounded-full blur-2xl opacity-60"></div>
                        <div className="absolute -right-10 -top-10 w-48 h-48 bg-mercurio-yellow/5 rounded-full blur-2xl opacity-40"></div>
                        
                        <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-between">
                            <div className="space-y-4">
                                <Image
                                    src="/images/logos/logomercurio.png"
                                    alt="Pinturerías Mercurio"
                                    width={160}
                                    height={50}
                                    className="h-auto w-auto max-w-[160px] drop-shadow-xl"
                                />
                                <span className="block text-[9px] font-black text-mercurio-yellow uppercase tracking-widest mt-2">
                                    Calidad y Asesoramiento
                                </span>
                            </div>

                            <div className="space-y-3 mt-6">
                                <p className="text-xs text-slate-400 font-light leading-relaxed">
                                    "Cada color y solución que ofrecemos está respaldada por años de experiencia y la calidad de las marcas líderes del mercado."
                                </p>
                                <span className="block text-[10px] font-extrabold uppercase tracking-wide text-mercurio-pink">
                                    Pinturerías Mercurio
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Valores Section */}
                <div className="mt-28 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <span className="text-[10px] font-black tracking-widest text-mercurio-green uppercase">Nuestros Pilares</span>
                        <h2 className="text-3xl md:text-4.5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            Nuestros Valores
                        </h2>
                        <div className="w-12 h-1 bg-mercurio-green mx-auto rounded-full"></div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                            Los principios éticos que nos guían en el trato diario con nuestros colaboradores, clientes y comunidad.
                        </p>
                    </div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((val, idx) => {
                            const Icon = val.icon;
                            return (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className={`glass bg-white dark:bg-slate-900/40 p-6 md:p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/5 hover:bg-slate-100/50 dark:hover:bg-slate-900/60 shadow-sm flex flex-col justify-between gap-4 transition-all duration-300 group border-b-4 ${val.borderColor}`}
                                >
                                    <div className="space-y-4">
                                        <div className={`inline-flex p-3 rounded-2xl ${val.iconColor} transition-transform group-hover:scale-110`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                            {val.name}
                                        </h4>
                                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                                            {val.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Principio Rector Container */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative overflow-hidden bg-gradient-to-r from-mercurio-blue/10 via-mercurio-pink/5 to-mercurio-yellow/5 border border-slate-200/80 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center max-w-4xl mx-auto shadow-xl group mt-8"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-mercurio-pink/5 to-mercurio-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                        
                        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
                            <div className="inline-flex p-3 bg-mercurio-yellow/15 text-mercurio-yellow rounded-full animate-float">
                                <Sparkles className="w-7 h-7" />
                            </div>
                            <span className="block text-[10px] font-black tracking-widest text-mercurio-pink uppercase">Principio Rector</span>
                            <h3 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                Actitud Servicial
                            </h3>
                            <p className="text-sm md:text-base text-slate-650 dark:text-slate-300 font-light leading-relaxed">
                                La actitud servicial aúna a todos nuestros valores y se define todos los días, cada vez que un cliente nos deposita su confianza ingresando a alguno de nuestros locales.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Call to Actions (Next Steps) */}
                <div className="mt-28 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <Link href="/sucursales" className="group">
                        <div className="glass bg-white dark:bg-slate-900/40 p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/5 hover:border-mercurio-blue/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-6 h-full relative overflow-hidden">
                            <div className="absolute right-0 bottom-0 translate-y-6 translate-x-6 w-32 h-32 bg-mercurio-blue/5 rounded-full blur-2xl group-hover:bg-mercurio-blue/10 transition-colors"></div>
                            <div className="space-y-3">
                                <span className="text-[10px] font-black tracking-wider text-mercurio-blue uppercase bg-mercurio-blue/10 px-2.5 py-1 rounded-full">Encontranos</span>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Nuestras Sucursales</h4>
                                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-light">
                                    Contamos con 18 sucursales ubicadas estratégicamente en Santa Fe, Santo Tomé y Esperanza. Buscá tu local más cercano.
                                </p>
                            </div>
                            <div className="text-xs font-bold text-mercurio-blue group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                                Ver mapa y horarios →
                            </div>
                        </div>
                    </Link>

                    <Link href="/contacto" className="group">
                        <div className="glass bg-white dark:bg-slate-900/40 p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/5 hover:border-mercurio-pink/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-6 h-full relative overflow-hidden">
                            <div className="absolute right-0 bottom-0 translate-y-6 translate-x-6 w-32 h-32 bg-mercurio-pink/5 rounded-full blur-2xl group-hover:bg-mercurio-pink/10 transition-colors"></div>
                            <div className="space-y-3">
                                <span className="text-[10px] font-black tracking-wider text-mercurio-pink uppercase bg-mercurio-pink/10 px-2.5 py-1 rounded-full">Asesoramiento</span>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Contacto Experto</h4>
                                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-light">
                                    ¿Tenés dudas sobre colores o productos? Ponete en contacto con nuestro equipo técnico y recibí asesoramiento personalizado.
                                </p>
                            </div>
                            <div className="text-xs font-bold text-mercurio-pink group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                                Escribinos ahora →
                            </div>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}
