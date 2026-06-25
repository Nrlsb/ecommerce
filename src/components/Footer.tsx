'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { 
    Mail, 
    Clock, 
    ArrowRight, 
    Phone, 
    ShieldCheck, 
    Sparkles, 
    ExternalLink,
    DollarSign
} from 'lucide-react';

export default function Footer() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
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

    const footerLinks = [
        { name: 'Sobre Mercurio', href: '/sobre-mercurio' },
        { name: 'Sucursales', href: '/sucursales' },
        { name: 'Unidades de Negocio', href: '/unidades-de-negocio' },
        { name: 'Servicios', href: '/servicios' },
        { name: 'Contacto', href: '/contacto' },
        { name: 'Términos y condiciones', href: '/terminos' },
        { name: 'Preguntas Frecuentes', href: '/preguntas-frecuentes' },
        { name: 'Medios de Pago', href: '/medios-de-pago' },
    ];

    const paymentMethods = [
        { name: 'VISA', color: 'group-hover:text-blue-400 group-hover:border-blue-500/30' },
        { name: 'MASTERCARD', color: 'group-hover:text-orange-400 group-hover:border-orange-500/30' },
        { name: 'AMEX', color: 'group-hover:text-cyan-400 group-hover:border-cyan-500/30' },
        { name: 'NARANJAX', color: 'group-hover:text-amber-500 group-hover:border-amber-500/30' },
        { name: 'BANELCO', color: 'group-hover:text-red-400 group-hover:border-red-500/30' }
    ];

    return (
        <footer className="relative bg-[#020617] text-white pt-28 pb-12 overflow-hidden border-t border-white/5">
            {/* Background Decorative Gradient Elements */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-mercurio-blue via-mercurio-pink to-mercurio-yellow opacity-85"></div>
            
            {/* Decorative Glow Spots */}
            <div className="absolute -top-32 right-10 w-[500px] h-[500px] bg-mercurio-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-1/2 left-10 w-[400px] h-[400px] bg-mercurio-pink/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] bg-mercurio-yellow/5 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                
                {/* Newsletter Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative pb-16 mb-20 border-b border-white/10 z-10"
                >
                    <div className="glass dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col lg:flex-row justify-between items-center gap-10 shadow-2xl relative overflow-hidden group">
                        {/* Decorative internal card light */}
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-tr from-mercurio-pink/10 to-mercurio-blue/5 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000 pointer-events-none"></div>
                        
                        <div className="max-w-xl text-center lg:text-left space-y-3 relative z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-mercurio-blue/20 to-mercurio-pink/20 border border-white/10 text-mercurio-pink">
                                <Sparkles className="w-3.5 h-3.5" />
                                Novedades y Tendencias
                            </span>
                            <h4 className="text-white text-2xl md:text-3xl font-black tracking-tight font-display">
                                Suscribite a nuestro Newsletter
                            </h4>
                            <p className="text-slate-400 text-sm md:text-base font-light leading-relaxed">
                                Recibí ofertas exclusivas, guías de combinación de color y tendencias directamente en tu correo electrónico.
                            </p>
                        </div>
                        
                        <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 min-w-full sm:min-w-[400px] md:min-w-[500px] relative z-10">
                            <div className="relative flex-1 group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-mercurio-pink transition-colors" />
                                <input 
                                    type="email" 
                                    placeholder="Tu correo electrónico" 
                                    className="w-full pl-12 pr-5 py-4 bg-slate-950/80 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-mercurio-pink focus:ring-1 focus:ring-mercurio-pink transition-all placeholder:text-slate-500 shadow-inner"
                                    required
                                />
                            </div>
                            <motion.button 
                                type="submit" 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 bg-gradient-to-r from-mercurio-blue via-mercurio-pink to-mercurio-yellow bg-[length:200%_auto] hover:bg-right text-white text-sm font-bold rounded-2xl transition-all duration-500 shadow-xl shadow-mercurio-pink/10 hover:shadow-mercurio-pink/30 cursor-pointer whitespace-nowrap"
                            >
                                Suscribirme
                            </motion.button>
                        </form>
                    </div>
                </motion.div>

                {/* Footer Main Links Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-16 gap-x-8 xl:gap-x-12 relative z-10"
                >
                    {/* Logo & Brand Column */}
                    <motion.div variants={itemVariants} className="lg:col-span-3 md:col-span-1 space-y-6">
                        <Link href="/" className="inline-block group transition-transform duration-300 hover:scale-105">
                            <Image
                                src="/images/logos/logomercurio.png"
                                alt="Mercurio Pinturerías"
                                width={180}
                                height={60}
                                className="h-auto w-auto max-w-[200px] drop-shadow-2xl"
                                priority
                            />
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed font-light">
                            Expertos en color y soluciones para transformar y dar vida a tus proyectos. Inspirando hogares desde 2021.
                        </p>
                    </motion.div>

                    {/* Somos Mercurio Column */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 md:col-span-1">
                        <h3 className="text-white font-bold text-xs mb-8 uppercase tracking-[0.2em] relative inline-block">
                            Somos Mercurio
                            <span className="absolute -bottom-2.5 left-0 w-8 h-[2px] bg-mercurio-yellow"></span>
                        </h3>
                        <ul className="space-y-4 text-sm">
                            {footerLinks.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-400 hover:text-mercurio-yellow transition-all duration-300 flex items-center group/link">
                                        <span className="w-0 group-hover/link:w-2 h-[2px] bg-mercurio-yellow mr-0 group-hover/link:mr-2.5 transition-all duration-300 rounded-full"></span>
                                        <span className="group-hover/link:translate-x-0.5 transition-transform duration-300">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Atención al Cliente Column */}
                    <motion.div variants={itemVariants} className="lg:col-span-3 md:col-span-1 min-w-0">
                        <h3 className="text-white font-bold text-xs mb-8 uppercase tracking-[0.2em] relative inline-block">
                            Atención al Cliente
                            <span className="absolute -bottom-2.5 left-0 w-8 h-[2px] bg-mercurio-pink"></span>
                        </h3>
                        <div className="space-y-6 text-sm">
                            <a href="mailto:consultas@pintureriamercurio.com.ar" className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group/item min-w-0 w-full">
                                <div className="p-2 rounded-xl bg-slate-900 border border-white/5 group-hover/item:border-mercurio-pink/30 group-hover/item:text-mercurio-pink transition-colors shrink-0">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-slate-500 text-[10px] uppercase tracking-widest font-bold">Email</span>
                                    <span className="text-xs sm:text-sm font-medium border-b border-transparent group-hover/item:border-white/20 pb-0.5 transition-all block break-all lg:break-normal">
                                        consultas@<wbr />pintureriamercurio.com.ar
                                    </span>
                                </div>
                            </a>
                            
                            <div className="flex items-start gap-3 text-slate-400 min-w-0 w-full">
                                <div className="p-2 rounded-xl bg-slate-900 border border-white/5 shrink-0">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-slate-500 text-[10px] uppercase tracking-widest font-bold">Horarios</span>
                                    <p className="text-slate-300 text-xs sm:text-sm font-light">Lunes a Viernes</p>
                                    <p className="text-white font-bold text-sm sm:text-base mt-0.5 truncate">08:00 a 17:00 hs</p>
                                </div>
                            </div>

                            <a href="https://wa.me/5491122334455" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group/item min-w-0 w-full">
                                <div className="p-2 rounded-xl bg-slate-900 border border-white/5 group-hover/item:border-mercurio-green/30 group-hover/item:text-mercurio-green transition-colors relative shrink-0">
                                    <Phone className="w-4 h-4" />
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-[#25D366] rounded-full animate-ping"></span>
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-[#25D366] rounded-full"></span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-slate-500 text-[10px] uppercase tracking-widest font-bold">WhatsApp Ventas</span>
                                    <span className="text-xs sm:text-sm font-medium border-b border-transparent group-hover/item:border-white/20 pb-0.5 transition-all block truncate">
                                        +54 9 11 2233-4455
                                    </span>
                                </div>
                            </a>
                        </div>
                    </motion.div>

                    {/* Medios de Pago Column */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 md:col-span-1">
                        <h3 className="text-white font-bold text-xs mb-8 uppercase tracking-[0.2em] relative inline-block">
                            Medios de Pago
                            <span className="absolute -bottom-2.5 left-0 w-8 h-[2px] bg-mercurio-blue"></span>
                        </h3>
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2">
                                {paymentMethods.map((card) => (
                                    <motion.div 
                                        key={card.name} 
                                        whileHover={{ y: -3, scale: 1.02 }}
                                        className="group bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-white/10 px-3 py-2 rounded-xl text-center transition-all cursor-default shadow-sm shrink-0"
                                    >
                                        <span className={`text-[10px] font-black tracking-wider text-slate-400 transition-colors ${card.color}`}>
                                            {card.name}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                            <Link href="/medios-de-pago" className="inline-flex items-center text-xs font-semibold text-mercurio-yellow hover:text-white transition-colors group/promo">
                                <DollarSign className="w-3.5 h-3.5 mr-1" />
                                Ver promociones y cuotas
                                <ArrowRight className="ml-1.5 w-3.5 h-3.5 transform group-hover/promo:translate-x-1.5 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Seguinos Column */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 md:col-span-1">
                        <h3 className="text-white font-bold text-xs mb-8 uppercase tracking-[0.2em] relative inline-block">
                            Seguinos En
                            <span className="absolute -bottom-2.5 left-0 w-8 h-[2px] bg-mercurio-green"></span>
                        </h3>
                        <div className="flex gap-4">
                            <SocialLink
                                href="https://www.facebook.com/pintureriasmercurio/"
                                icon={<FacebookIcon />}
                                label="Facebook"
                                hoverColor="hover:bg-[#1877F2] hover:border-[#1877F2]/30 hover:shadow-[#1877F2]/20"
                            />
                            <SocialLink
                                href="https://www.instagram.com/pint_mercurio/"
                                icon={<InstagramIcon />}
                                label="Instagram"
                                hoverColor="hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:border-pink-500/30 hover:shadow-pink-500/20"
                            />
                            <SocialLink
                                href="https://www.youtube.com/channel/UCRMyNc7T6iKYVT-7WQgLS7w"
                                icon={<YoutubeIcon />}
                                label="YouTube"
                                hoverColor="hover:bg-[#FF0000] hover:border-[#FF0000]/30 hover:shadow-[#FF0000]/20"
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Marco Legal y Fiscal */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10"
                >
                    {/* Botón de Arrepentimiento */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <Link href="/arrepentimiento" className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-slate-900 hover:bg-slate-950 border border-white/10 rounded-2xl transition-all duration-300 group shadow-md relative overflow-hidden">
                            <span className="absolute inset-0 bg-gradient-to-r from-mercurio-pink/10 to-mercurio-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                            <ShieldCheck className="w-4 h-4 text-mercurio-pink group-hover:scale-110 transition-transform relative z-10" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-mercurio-pink transition-colors relative z-10">
                                Botón de Arrepentimiento
                            </span>
                        </Link>
                        <span className="text-[10px] text-slate-500 font-medium text-center md:text-left leading-relaxed">
                            Defensa de las y los Consumidores. Para reclamos ingrese{' '}
                            <a href="https://autogestion.produccion.gob.ar/consumidor" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors inline-flex items-center gap-0.5">
                                aquí <ExternalLink className="w-2.5 h-2.5" />
                            </a>.
                        </span>
                    </div>

                    {/* Data Fiscal ARCA/AFIP */}
                    <div className="flex items-center gap-4">
                        <motion.a 
                            href="#" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="transition-all bg-white p-2 rounded-2xl shadow-lg border border-white/10 block" 
                            title="Data Fiscal"
                        >
                            <img src="https://www.afip.gob.ar/images/f960/DATAWEB.jpg" alt="Data Fiscal" className="w-10 h-auto object-contain" />
                        </motion.a>
                    </div>
                </motion.div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-600 uppercase text-center md:text-left">
                        © 2021-{new Date().getFullYear()} | MERCURIO PINTRURERÍAS. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-600 uppercase">Desarrollado por</span>
                        <a href="#" className="text-[10px] font-black text-slate-400 hover:text-mercurio-yellow transition-colors tracking-wide">
                            Pinturerías Mercurio
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

interface SocialLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    hoverColor: string;
}

function SocialLink({ href, icon, label, hoverColor }: SocialLinkProps) {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 flex items-center justify-center bg-slate-900 border border-white/5 rounded-2xl text-white transition-all duration-300 ${hoverColor} hover:shadow-lg group relative`}
        >
            <div className="transform group-hover:scale-105 transition-transform duration-300 z-10">
                {icon}
            </div>
            {/* Tooltip */}
            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-300 bg-slate-950 border border-white/10 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap shadow-xl pointer-events-none z-50">
                {label}
            </span>
        </motion.a>
    );
}

function FacebookIcon() {
    return (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function YoutubeIcon() {
    return (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58z" />
            <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
        </svg>
    );
}



