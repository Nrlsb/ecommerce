'use client';

import Link from 'next/link';
import { Clock, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PendingPage() {
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
                    className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <Clock className="w-12 h-12" />
                </motion.div>

                <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight">
                    Pago Pendiente
                </h1>
                
                <p className="text-foreground/60 mb-8">
                    Tu pago está siendo procesado por la entidad financiera. Te avisaremos por correo una vez que sea aprobado.
                </p>

                <div className="space-y-4 pt-4">
                    <Link 
                        href="/catalogo"
                        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg active:scale-95"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Seguir Explorando
                    </Link>
                    
                    <Link 
                        href="/"
                        className="w-full bg-secondary text-secondary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all border border-border"
                    >
                        Ir al Inicio
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
                
                <div className="mt-8 p-4 bg-muted/50 rounded-2xl border border-border text-xs text-foreground/50">
                    <p>Si pagaste por transferencia o en efectivo, la acreditación puede tardar hasta 48 horas hábiles.</p>
                </div>
            </motion.div>
        </div>
    );
}
