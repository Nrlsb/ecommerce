'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2, Package } from 'lucide-react';
import { motion } from 'framer-motion';

function SuccessPageContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const [pedido, setPedido] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    // Mercado Pago envía parámetros como payment_id, status, external_reference, etc.
    const paymentId = searchParams.get('payment_id');
    const pedidoId = searchParams.get('pedido_id') || searchParams.get('external_reference');

    useEffect(() => {
        // Vaciamos el carrito apenas carga la página de éxito
        clearCart();
        
        async function fetchPedido() {
            if (pedidoId) {
                try {
                    const response = await fetch(`/api/pedidos/detalle?id=${pedidoId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setPedido(data);
                    }
                } catch (err) {
                    console.error('Error fetching order details:', err);
                }
            }
            setLoading(false);
        }
        
        fetchPedido();
    }, [clearCart, pedidoId]);

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
                
                <p className="text-foreground/60 mb-6">
                    Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
                </p>
                
                {loading ? (
                    <div className="flex justify-center items-center py-4 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        <span className="text-sm">Buscando detalles...</span>
                    </div>
                ) : pedido ? (
                    <div className="bg-muted/50 rounded-2xl p-4 mb-8 text-left border border-border">
                        <h3 className="font-bold flex items-center gap-2 mb-3 border-b border-border/50 pb-2">
                            <Package className="w-4 h-4 text-primary" />
                            Detalle del Pedido #{pedido.nro_pedido || pedido.id}
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-foreground/60">Cliente:</span>
                                <span className="font-medium truncate max-w-[150px]">{pedido.cliente_nombre || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-foreground/60">Método de pago:</span>
                                <span className="font-medium capitalize">{pedido.metodo_pago}</span>
                            </div>
                            {pedido.metodo_pago === 'payway' && pedido.payway_log?.checkout?.request?.installments && (() => {
                                const rawInst = Number(pedido.payway_log.checkout.request.installments);
                                const actualInst = rawInst === 13 ? 3 : rawInst === 16 ? 6 : rawInst;
                                return (
                                    <div className="flex justify-between">
                                        <span className="text-foreground/60">Financiación:</span>
                                        <span className="font-medium text-foreground">
                                            {actualInst === 1 
                                                ? '1 cuota sin interés' 
                                                : `${actualInst} cuotas de $${(pedido.total / actualInst).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                            }
                                        </span>
                                    </div>
                                );
                            })()}
                            <div className="flex justify-between pt-2 mt-2 border-t border-border/50">
                                <span className="font-bold">Total Pagado:</span>
                                <span className="font-bold text-primary">${pedido.total?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-muted py-3 px-4 rounded-xl mb-8">
                        <p className="text-sm text-foreground/80">ID de Referencia: {pedidoId || paymentId || 'Desconocido'}</p>
                    </div>
                )}

                <div className="space-y-4">
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
