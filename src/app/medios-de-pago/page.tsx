'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    CreditCard, 
    Wallet, 
    Calendar, 
    AlertTriangle, 
    CheckCircle2, 
    Clock, 
    ChevronDown, 
    Info, 
    ShieldCheck,
    Coins,
    Building2,
    Percent
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    VisaIcon, 
    MastercardIcon, 
    AmexIcon, 
    MaestroIcon, 
    NaranjaXBadge, 
    CabalBadge, 
    NativaBadge, 
    CencosudBadge, 
    ShoppingBadge, 
    CordobesaBadge, 
    CMRBadge, 
    ArgencardBadge, 
    DinersBadge, 
    PagoFacilBadge, 
    RapipagoBadge, 
    ProvinciaNetBadge, 
    RedLinkBadge 
} from '@/components/ui/PaymentIcons';

export default function MediosDePagoPage() {
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const [showLimits, setShowLimits] = useState(false);

    const toggleAccordion = (id: string) => {
        setActiveAccordion(prev => (prev === id ? null : id));
    };

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 font-sans antialiased pb-20">
            
            {/* Header decorativo estilo Premium */}
            <div className="relative overflow-hidden py-20 bg-[#020617] border-b border-white/5">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-mercurio-blue via-mercurio-pink to-mercurio-yellow"></div>
                
                {/* Luces decorativas de fondo */}
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-tr from-mercurio-blue/10 to-mercurio-pink/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-gradient-to-tr from-mercurio-yellow/5 to-mercurio-pink/5 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white mb-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300">
                        <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
                    </Link>
                    
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-mercurio-blue uppercase tracking-widest">
                        Información de Compra
                    </span>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase font-display bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Medios de Pago
                    </h1>
                    
                    <p className="text-slate-400 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
                        Conocé todas las opciones de pago que tenemos disponibles para concretar tus pedidos de manera rápida y 100% segura.
                    </p>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="max-w-5xl mx-auto px-6 mt-12 space-y-8">
                
                {/* Cuotas sin interés Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-mercurio-blue/20 via-mercurio-pink/10 to-mercurio-yellow/10 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-mercurio-pink/10 to-mercurio-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                    <div className="space-y-2 text-center sm:text-left z-10">
                        <span className="text-[10px] font-black tracking-widest text-mercurio-pink bg-mercurio-pink/10 px-2.5 py-1 rounded-full uppercase">
                            Promoción Especial
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                            6 CUOTAS SIN INTERÉS
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
                            Y hasta un <strong className="text-mercurio-yellow font-black">45% OFF</strong> en productos seleccionados.
                        </p>
                    </div>
                    <div className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl text-sm font-black shadow-lg z-10 transition-transform group-hover:scale-105">
                        Ver Productos en Oferta
                    </div>
                </div>

                {/* Grid de Medios de Pago */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Tarjeta de Crédito */}
                    <div className="glass bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5 p-8 rounded-[2rem] shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden group">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F8F0] dark:bg-[#10B981]/15 text-[#10B981]">
                                    <Clock className="w-3.5 h-3.5" />
                                    Acreditación Instantánea
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                Tarjeta de crédito en hasta 12 cuotas
                            </h3>
                            
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                                Ingresás los datos de tu tarjeta de crédito al pagar y listo. La próxima vez que quieras usar esta tarjeta, solo te pediremos el código de seguridad.
                            </p>
                            
                            {/* Logos de Tarjetas de Crédito */}
                            <div className="pt-2 flex flex-wrap gap-2.5 items-center">
                                <VisaIcon />
                                <MastercardIcon />
                                <AmexIcon />
                                <NaranjaXBadge />
                                <CabalBadge />
                                <NativaBadge />
                                <ShoppingBadge />
                                <CencosudBadge />
                                <ArgencardBadge />
                                <DinersBadge />
                                <CordobesaBadge />
                                <CMRBadge />
                            </div>
                        </div>

                        {/* Accordiones internos de Financiación y Promos */}
                        <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
                            {/* Acordeón Costos de Financiación */}
                            <div className="border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20">
                                <button 
                                    onClick={() => toggleAccordion('financiacion')}
                                    className="w-full px-5 py-3.5 flex items-center justify-between text-left cursor-pointer group/btn"
                                >
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 group-hover/btn:text-mercurio-pink transition-colors">
                                        <Percent className="w-4 h-4 text-slate-400 group-hover/btn:text-mercurio-pink transition-colors" />
                                        Costos de financiación por pagar en cuotas
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${activeAccordion === 'financiacion' ? 'rotate-180 text-mercurio-pink' : ''}`} />
                                </button>
                                <AnimatePresence initial={false}>
                                    {activeAccordion === 'financiacion' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <div className="px-5 pb-5 pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light space-y-3">
                                                <p>
                                                    Ofrecemos planes de cuotas financiadas según los convenios vigentes de Mercado Pago. Podés pagar en hasta 12 cuotas con interés con tasas reducidas.
                                                </p>
                                                <div className="overflow-x-auto border border-slate-100 dark:border-white/5 rounded-xl">
                                                    <table className="w-full text-left text-[11px]">
                                                        <thead>
                                                            <tr className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold">
                                                                <th className="p-2">Plan</th>
                                                                <th className="p-2">CFT (Financiación)</th>
                                                                <th className="p-2">Tasa Nominal</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                                            <tr>
                                                                <td className="p-2 font-medium">1 Pago</td>
                                                                <td className="p-2 text-green-500 font-bold">0.00% (Sin interés)</td>
                                                                <td className="p-2">0.00%</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="p-2 font-medium">3 Cuotas Simple</td>
                                                                <td className="p-2">12.50% (Subsidiado)</td>
                                                                <td className="p-2">9.80%</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="p-2 font-medium">6 Cuotas Simple</td>
                                                                <td className="p-2 text-green-500 font-bold">0.00% (Bancos Select.)</td>
                                                                <td className="p-2">0.00%</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="p-2 font-medium">9 Cuotas</td>
                                                                <td className="p-2">34.80%</td>
                                                                <td className="p-2">28.40%</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="p-2 font-medium">12 Cuotas</td>
                                                                <td className="p-2">49.90%</td>
                                                                <td className="p-2">39.10%</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <p className="italic text-[10px] text-slate-400">
                                                    * Los costos reales e impuestos correspondientes (según provincia) se computarán al momento del checkout tras ingresar los dígitos del emisor de tu tarjeta.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Acordeón Promociones Bancarias */}
                            <div className="border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20">
                                <button 
                                    onClick={() => toggleAccordion('promos')}
                                    className="w-full px-5 py-3.5 flex items-center justify-between text-left cursor-pointer group/btn"
                                >
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 group-hover/btn:text-mercurio-pink transition-colors">
                                        <Building2 className="w-4 h-4 text-slate-400 group-hover/btn:text-mercurio-pink transition-colors" />
                                        Promociones bancarias de cuotas sin interés
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${activeAccordion === 'promos' ? 'rotate-180 text-mercurio-pink' : ''}`} />
                                </button>
                                <AnimatePresence initial={false}>
                                    {activeAccordion === 'promos' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <div className="px-5 pb-5 pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light space-y-3">
                                                <ul className="list-disc pl-4 space-y-2">
                                                    <li>
                                                        <strong className="text-slate-800 dark:text-white font-bold">Banco Nación / BNA+:</strong> 6 cuotas sin interés todos los días utilizando tarjetas Nativa Visa o Nativa Mastercard.
                                                    </li>
                                                    <li>
                                                        <strong className="text-slate-800 dark:text-white font-bold">Banco Macro:</strong> 3 y 6 cuotas sin interés los días martes y jueves con tarjetas Visa y Mastercard Macro.
                                                    </li>
                                                    <li>
                                                        <strong className="text-slate-800 dark:text-white font-bold">Tarjeta Naranja X:</strong> Plan Z (3 cuotas sin interés) o hasta 6 cuotas sin interés los días lunes en sucursales y online.
                                                    </li>
                                                    <li>
                                                        <strong className="text-slate-800 dark:text-white font-bold">Banco Provincia (BAPRO):</strong> 6 cuotas sin interés en compras online con tarjetas Visa y Mastercard emitidas por el banco los fines de semana seleccionados.
                                                    </li>
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de Débito */}
                    <div className="glass bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5 p-8 rounded-[2rem] shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden group">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F8F0] dark:bg-[#10B981]/15 text-[#10B981]">
                                    <Clock className="w-3.5 h-3.5" />
                                    Acreditación Instantánea
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                Tarjeta de débito
                            </h3>
                            
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                                Ingresás los datos completos una sola vez y en futuras compras solo te pediremos el código de seguridad. La acreditación es inmediata y sin costos extras.
                            </p>
                            
                            {/* Logos de Tarjetas de Débito */}
                            <div className="pt-2 flex flex-wrap gap-3.5 items-center">
                                <VisaIcon />
                                <span className="text-[10px] font-black text-slate-400 uppercase border border-slate-200/60 dark:border-white/10 px-1.5 py-0.5 rounded bg-slate-50 dark:bg-white/5">Débito</span>
                                <MastercardIcon />
                                <span className="text-[10px] font-black text-slate-400 uppercase border border-slate-200/60 dark:border-white/10 px-1.5 py-0.5 rounded bg-slate-50 dark:bg-white/5">Débito</span>
                                <MaestroIcon />
                                <CabalBadge />
                                <span className="text-[9px] font-black text-slate-400 uppercase border border-slate-200/60 dark:border-white/10 px-1.5 py-0.5 rounded bg-slate-50 dark:bg-white/5">Débito</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-2xl flex gap-3 items-start text-xs text-slate-500 dark:text-slate-400 font-light">
                            <ShieldCheck className="w-5 h-5 text-mercurio-blue flex-shrink-0" />
                            <p>
                                Tus datos bancarios están protegidos bajo protocolos de encriptación HTTPS/SSL de grado militar a través del gateway homologado de Mercado Pago. Pinturerías Mercurio nunca almacena tu información de pago.
                            </p>
                        </div>
                    </div>

                    {/* Efectivo en puntos de pago */}
                    <div className="glass bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5 p-8 rounded-[2rem] shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden group">
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-600 dark:text-yellow-400">
                                    <Coins className="w-6 h-6" />
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                En efectivo en puntos de pago
                            </h3>
                            
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                                Al momento de pagar te decimos cómo hacerlo y dónde ir. Nada de ir a bancos y hacer largas colas, ¡vas a ver que es muy simple!
                            </p>
                            
                            {/* Logos de puntos de pago */}
                            <div className="pt-2 flex flex-wrap gap-3 items-center">
                                <PagoFacilBadge />
                                <RapipagoBadge />
                                <ProvinciaNetBadge />
                                <RedLinkBadge />
                            </div>

                            {/* Detalles de acreditación en efectivo */}
                            <div className="pt-4 space-y-3 border-t border-slate-100 dark:border-white/5">
                                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                                    <span>Pago Fácil, Rapipago y Carga Virtual se acreditan <strong>apenas pagás</strong>.</span>
                                </div>
                                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                                    <Calendar className="w-4 h-4 text-mercurio-blue mt-0.5 flex-shrink-0" />
                                    <span>Con Provincia NET Pagos pagás y se acredita en <strong>1 día hábil</strong>.</span>
                                </div>
                                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                                    <Calendar className="w-4 h-4 text-mercurio-blue mt-0.5 flex-shrink-0" />
                                    <span>Con RedLink se acredita de <strong>1 a 2 días hábiles</strong> después de que pagás.</span>
                                </div>
                            </div>
                        </div>

                        {/* Alerta de seguridad */}
                        <div className="pt-4 border-t border-slate-100 dark:border-white/5 bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl flex gap-3 items-start text-xs text-slate-600 dark:text-slate-400 font-light">
                            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                            <p>
                                <strong className="text-slate-800 dark:text-white font-extrabold block mb-1">Importante:</strong>
                                No pagues ninguna factura enviada directamente por un vendedor. Al terminar la compra en nuestro sitio web oficial, podés imprimir tu propia factura y cupón oficial de pago.
                            </p>
                        </div>
                    </div>

                    {/* Dinero en Mercado Pago */}
                    <div className="glass bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5 p-8 rounded-[2rem] shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden group">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="relative h-8 w-32">
                                    <Image 
                                        src="/images/logos/mercadopago.png" 
                                        alt="Mercado Pago" 
                                        fill
                                        sizes="(max-width: 768px) 100px, 120px"
                                        className="object-contain object-left" 
                                    />
                                </div>
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F8F0] dark:bg-[#10B981]/15 text-[#10B981]">
                                    <Clock className="w-3.5 h-3.5" />
                                    Acreditación Instantánea
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                Dinero en cuenta Mercado Pago
                            </h3>
                            
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                                Anticiparte y cargar saldo en tu cuenta de Mercado Pago es muy útil, porque al momento de comprar tu pago se acredita al instante sin necesidad de tarjetas ni demoras.
                            </p>

                            <div className="pt-4 space-y-3 border-t border-slate-100 dark:border-white/5">
                                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                                    <span>Podés cargar saldo con cualquiera de los medios de pago en efectivo descritos a la izquierda.</span>
                                </div>
                                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                                    <span>Acreditación <strong>100% instantánea</strong> al procesar el pedido.</span>
                                </div>
                                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                                    <span><strong>Sin costo adicional</strong> por uso de saldo virtual.</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-white/5 bg-blue-500/5 p-5 rounded-2xl flex gap-3 items-center text-xs text-slate-500 dark:text-slate-400 font-light">
                            <Info className="w-5 h-5 text-mercurio-blue flex-shrink-0" />
                            <p>
                                Podés usar el saldo que tengas en tu billetera digital de Mercado Pago seleccionando la opción "Mercado Pago" al momento de finalizar tu orden.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Banner de Límites de Dinero */}
                <div className="glass bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
                    <button 
                        onClick={() => setShowLimits(!showLimits)}
                        className="w-full p-6 md:p-8 flex items-center justify-between text-left cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-mercurio-blue/10 rounded-2xl text-mercurio-blue">
                                <Info className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm md:text-base font-black text-slate-900 dark:text-white group-hover:text-mercurio-blue transition-colors">
                                    Límites de dinero para procesar transacciones
                                </h4>
                                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-light">
                                    Los medios de pago tienen un límite de dinero que podemos procesar. <strong className="text-mercurio-blue font-bold group-hover:underline">Conocé cuáles son los montos mínimos y máximos.</strong>
                                </p>
                            </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${showLimits ? 'rotate-180 text-mercurio-blue' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                        {showLimits && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/40"
                            >
                                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-300 font-light">
                                    <div className="space-y-4">
                                        <h5 className="font-extrabold text-slate-800 dark:text-white uppercase tracking-wider text-xs border-b border-slate-200/50 dark:border-white/5 pb-2">
                                            Tarjetas y Saldo Digital
                                        </h5>
                                        <ul className="space-y-2.5 text-xs">
                                            <li className="flex justify-between">
                                                <span>Tarjeta de Crédito:</span>
                                                <strong className="font-bold text-slate-800 dark:text-white">Mín: $100 / Máx: Límite de Tarjeta</strong>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>Tarjeta de Débito:</span>
                                                <strong className="font-bold text-slate-800 dark:text-white">Mín: $100 / Máx: Límite de Cuenta</strong>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>Saldo Mercado Pago:</span>
                                                <strong className="font-bold text-slate-800 dark:text-white">Mín: $10 / Sin Máximo</strong>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h5 className="font-extrabold text-slate-800 dark:text-white uppercase tracking-wider text-xs border-b border-slate-200/50 dark:border-white/5 pb-2">
                                            Efectivo en Puntos de Pago
                                        </h5>
                                        <ul className="space-y-2.5 text-xs">
                                            <li className="flex justify-between">
                                                <span>Pago Fácil:</span>
                                                <strong className="font-bold text-slate-800 dark:text-white">Mín: $500 / Máx: $1.000.000 por día</strong>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>Rapipago:</span>
                                                <strong className="font-bold text-slate-800 dark:text-white">Mín: $500 / Máx: $1.000.000 por transacción</strong>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>Provincia NET Pagos:</span>
                                                <strong className="font-bold text-slate-800 dark:text-white">Mín: $500 / Máx: $800.000 por factura</strong>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>Red Link (Cajeros/Homebanking):</span>
                                                <strong className="font-bold text-slate-800 dark:text-white">Mín: $500 / Máx: $500.000 por orden</strong>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
