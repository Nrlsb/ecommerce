'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function SuccessPageContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    
    // Mercado Pago envía parámetros como payment_id, status, external_reference, etc.
    const paymentId = searchParams.get('payment_id');

    useEffect(() => {
        // Vaciamos el carrito apenas carga la página de éxito
        clearCart();
    }, [clearCart]);

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
                    className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle2 className="w-12 h-12" />
                </motion.div>

                <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight">
                    ¡Pago Aprobado!
                </h1>
                
                <p className="text-foreground/60 mb-2">
                    Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
                </p>
                
                {paymentId && (
                    <p className="text-xs font-mono text-foreground/40 mb-8 bg-muted py-2 px-3 rounded-lg inline-block">
                        ID de Pago: {paymentId}
                    </p>
                )}

                <div className="space-y-4 pt-4">
                    <Link 
                        href="/catalogo"
                        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg active:scale-95"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Seguir Comprando
                    </Link>
                    
                    <Link 
                        href="/"
                        className="w-full bg-secondary text-secondary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all border border-border"
                    >
                        Volver al Inicio
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
                
                <p className="text-[10px] text-foreground/30 mt-8">
                    Recibirás un correo electrónico con los detalles de tu pedido y el seguimiento del envío.
                </p>
            </motion.div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
                <div className="animate-pulse text-foreground/50 font-medium">Cargando confirmación...</div>
            </div>
        }>
            <SuccessPageContent />
        </Suspense>
    );
}
