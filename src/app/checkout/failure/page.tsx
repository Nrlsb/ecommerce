'use client';

import Link from 'next/link';
import { XCircle, ShoppingCart, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FailurePage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-2xl text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2 
                    }}
                    className="w-24 h-24 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <XCircle className="w-12 h-12" />
                </motion.div>

                <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight">
                    Pago Fallido
                </h1>
                
                <p className="text-foreground/60 mb-6">
                    Lo sentimos, no pudimos procesar tu pago. Por favor, verifica los datos e intenta nuevamente.
                </p>

                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-4 mb-8 flex items-start gap-3 text-left">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-bold text-red-900 dark:text-red-400">¿Qué pudo pasar?</h4>
                        <ul className="text-xs text-red-800 dark:text-red-400/80 list-disc list-inside mt-1 space-y-1">
                            <li>Fondos insuficientes</li>
                            <li>Límite de tarjeta excedido</li>
                            <li>Datos de tarjeta incorrectos</li>
                            <li>Conexión interrumpida</li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-4">
                    <Link 
                        href="/carrito"
                        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg active:scale-95"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Volver al Carrito
                    </Link>
                    
                    <Link 
                        href="/contacto"
                        className="w-full bg-secondary text-secondary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all border border-border"
                    >
                        Necesito Ayuda
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
