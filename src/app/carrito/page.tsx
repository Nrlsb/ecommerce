'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react';

export default function CarritoPage() {
    const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    cliente_nombre: 'Cliente Web',
                    cliente_email: 'cliente@ejemplo.com',
                    total: totalPrice
                })
            });

            const data = await response.json();

            if (response.ok && data.initPoint) {
                // Redirigir a MercadoPago
                window.location.href = data.initPoint;
            } else if (response.ok) {
                alert('¡Pedido creado exitosamente con ID: ' + data.pedidoId);
                clearCart();
            } else {
                alert('Error: ' + data.error);
            }
        } catch (e) {
            alert('Error de conexión: ' + (e instanceof Error ? e.message : String(e)));
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
                <h2 className="text-3xl font-bold text-foreground mb-4">Tu carrito está vacío</h2>
                <p className="text-foreground/60 mb-8 max-w-md text-center">Parece que aún no has agregado productos a tu carrito. ¡Explora nuestro catálogo para encontrar los mejores colores!</p>
                <Link href="/catalogo" className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 px-8 py-3 rounded-xl transition-all shadow-md">
                    Ir al Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/catalogo" className="inline-flex items-center text-foreground/60 hover:text-primary transition-colors text-sm font-medium mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Seguir Comprando
                    </Link>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Tu Carrito</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Productos en el Carrito */}
                    <div className="flex-1 space-y-4">
                        {items.map((item: any) => (
                            <div key={item.id} className="bg-card border border-border p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-sm">
                                <div className="w-full sm:w-24 h-24 bg-gradient-to-tr from-secondary to-muted rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-foreground/30 font-bold uppercase text-xs">{item.brand}</span>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-foreground line-clamp-2">{item.name}</h3>
                                    <p className="text-sm text-primary font-medium mt-1">${item.price.toLocaleString('es-AR')} c/u</p>
                                </div>

                                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 mt-4 sm:mt-0">
                                    <div className="flex items-center border border-border rounded-xl p-1 bg-background">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-muted text-foreground rounded-lg transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-muted text-foreground rounded-lg transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-black text-xl text-foreground">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-destructive/70 hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-lg"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen de Compra */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-card border border-border rounded-2xl p-6 sticky top-24 shadow-sm">
                            <h2 className="text-xl font-bold border-b border-border pb-4 mb-4">Resumen del Pedido</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-foreground/80">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toLocaleString('es-AR')}</span>
                                </div>
                                <div className="flex justify-between text-foreground/80">
                                    <span>Envío</span>
                                    <span className={totalPrice > 50000 ? 'text-green-600 font-medium' : ''}>
                                        {totalPrice > 50000 ? 'Gratis' : 'Calculado en el checkout'}
                                    </span>
                                </div>
                                {totalPrice <= 50000 && (
                                    <p className="text-xs text-primary/80 mt-1">
                                        Agrega ${(50000 - totalPrice).toLocaleString('es-AR')} más para obtener envío gratis.
                                    </p>
                                )}
                            </div>

                            <div className="border-t border-border pt-4 mb-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-3xl font-black text-primary">${totalPrice.toLocaleString('es-AR')}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                            >
                                <CreditCard className="w-5 h-5" /> {isProcessing ? 'Procesando...' : 'Iniciar Pago'}
                            </button>

                            <div className="mt-4 text-center">
                                <span className="text-xs text-foreground/50 flex items-center justify-center gap-1">
                                    Transacción 100% segura y encriptada.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
