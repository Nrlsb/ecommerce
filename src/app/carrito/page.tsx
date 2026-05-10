'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import Script from 'next/script';

export default function CarritoPage() {
    const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'payway'>('mercadopago');

    // Estado para formulario Payway (Decidir)
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardHolderName: '',
        cardExpirationMonth: '',
        cardExpirationYear: '',
        securityCode: '',
        cardHolderIdentificationNumber: ''
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleCheckout = async () => {
        if (paymentMethod === 'mercadopago') {
            await processMercadoPago();
        } else {
            await processPayway();
        }
    };

    const processMercadoPago = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    cliente_nombre: 'Cliente Web',
                    cliente_email: 'cliente@ejemplo.com',
                    total: totalPrice,
                    metodo_pago: 'mercadopago'
                })
            });

            const data = await response.json();

            if (response.ok && data.initPoint) {
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

    const processPayway = () => {
        setIsProcessing(true);
        try {
            // Validaciones básicas
            if (!cardData.cardNumber || !cardData.securityCode) {
                alert('Por favor, complete los datos de la tarjeta.');
                setIsProcessing(false);
                return;
            }

            const dec = new (window as any).Decidir('https://sandbox.decidir.com/api/v2/'); // En producción usar URL de live
            dec.setPublishableKey(process.env.NEXT_PUBLIC_PAYWAY_PUBLIC_KEY || ''); // Requiere la key pública en .env
            dec.setTimeout(10000);

            dec.createToken({
                card_number: cardData.cardNumber.replace(/\s/g, ''),
                card_expiration_month: cardData.cardExpirationMonth,
                card_expiration_year: cardData.cardExpirationYear,
                security_code: cardData.securityCode,
                card_holder_name: cardData.cardHolderName,
                card_holder_identification: {
                    type: 'dni',
                    number: cardData.cardHolderIdentificationNumber
                }
            }, async (status: number, response: any) => {
                if (status === 200 || status === 201) {
                    // Token obtenido con éxito, enviar al backend
                    await sendPaywayPayment(response.id, response.bin);
                } else {
                    console.error("Error al tokenizar con Payway:", response);
                    alert('Error en tarjeta: ' + (response.error?.[0]?.error?.message || 'Verifique los datos'));
                    setIsProcessing(false);
                }
            });
        } catch (error) {
            console.error('Error al inicializar Decidir:', error);
            alert('Ocurrió un error al conectar con Payway.');
            setIsProcessing(false);
        }
    };

    const sendPaywayPayment = async (token: string, bin: string) => {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    cliente_nombre: cardData.cardHolderName || 'Cliente Web',
                    cliente_email: 'cliente@ejemplo.com',
                    total: totalPrice,
                    metodo_pago: 'payway',
                    payway_token: token,
                    bin: bin
                })
            });

            const data = await response.json();

            if (response.ok && data.redirectUrl) {
                clearCart();
                window.location.href = data.redirectUrl;
            } else if (response.ok) {
                alert('¡Pago exitoso con Payway!');
                clearCart();
            } else {
                alert('Error al procesar pago: ' + data.error);
            }
        } catch (e) {
            alert('Error de conexión: ' + (e instanceof Error ? e.message : String(e)));
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isMounted) {
        return <div className="min-h-screen bg-background" />;
    }

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
            <Script src="https://sandbox.decidir.com/api/v2/decidir.js" strategy="lazyOnload" />
            
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

                    {/* Resumen de Compra y Selección de Pago */}
                    <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold border-b border-border pb-4 mb-4">Método de Pago</h2>
                            
                            <div className="space-y-3 mb-6">
                                <label className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all hover:border-primary/50 ${paymentMethod === 'mercadopago' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card'}`}>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value="mercadopago" 
                                            checked={paymentMethod === 'mercadopago'} 
                                            onChange={() => setPaymentMethod('mercadopago')}
                                            className="w-4 h-4 text-primary border-border focus:ring-primary"
                                        />
                                        <span className="font-bold text-foreground">Mercado Pago</span>
                                    </div>
                                    <img src="/images/logos/mercadopago.png" alt="Mercado Pago" className="h-6 w-auto object-contain mix-blend-multiply dark:mix-blend-normal" />
                                </label>
                                
                                <label className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all hover:border-primary/50 ${paymentMethod === 'payway' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card'}`}>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value="payway" 
                                            checked={paymentMethod === 'payway'} 
                                            onChange={() => setPaymentMethod('payway')}
                                            className="w-4 h-4 text-primary border-border focus:ring-primary"
                                        />
                                        <span className="font-bold text-foreground">Tarjeta (Payway)</span>
                                    </div>
                                    <img src="/images/logos/payway.png" alt="Payway" className="h-6 w-auto object-contain mix-blend-multiply dark:mix-blend-normal" />
                                </label>
                            </div>

                            {paymentMethod === 'payway' && (
                                <div className="space-y-4 mb-6 p-4 bg-muted/30 rounded-xl border border-border">
                                    <div>
                                        <label className="text-xs font-semibold text-foreground/70 mb-1 block">Número de Tarjeta</label>
                                        <input 
                                            type="text" 
                                            placeholder="XXXX XXXX XXXX XXXX" 
                                            maxLength={19}
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                            value={cardData.cardNumber}
                                            onChange={(e) => setCardData({...cardData, cardNumber: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-foreground/70 mb-1 block">Nombre en la tarjeta</label>
                                        <input 
                                            type="text" 
                                            placeholder="COMO FIGURA EN LA TARJETA" 
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm uppercase"
                                            value={cardData.cardHolderName}
                                            onChange={(e) => setCardData({...cardData, cardHolderName: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs font-semibold text-foreground/70 mb-1 block">Vencimiento</label>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="MM" 
                                                    maxLength={2}
                                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-center"
                                                    value={cardData.cardExpirationMonth}
                                                    onChange={(e) => setCardData({...cardData, cardExpirationMonth: e.target.value})}
                                                />
                                                <span className="text-foreground/50 self-center">/</span>
                                                <input 
                                                    type="text" 
                                                    placeholder="AA" 
                                                    maxLength={2}
                                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-center"
                                                    value={cardData.cardExpirationYear}
                                                    onChange={(e) => setCardData({...cardData, cardExpirationYear: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-24">
                                            <label className="text-xs font-semibold text-foreground/70 mb-1 block">CVC</label>
                                            <input 
                                                type="password" 
                                                placeholder="XXX" 
                                                maxLength={4}
                                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-center"
                                                value={cardData.securityCode}
                                                onChange={(e) => setCardData({...cardData, securityCode: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-foreground/70 mb-1 block">DNI del Titular</label>
                                        <input 
                                            type="text" 
                                            placeholder="Sin puntos ni espacios" 
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                            value={cardData.cardHolderIdentificationNumber}
                                            onChange={(e) => setCardData({...cardData, cardHolderIdentificationNumber: e.target.value})}
                                        />
                                    </div>
                                </div>
                            )}

                            <h2 className="text-lg font-bold border-t border-border pt-4 mb-4">Resumen</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-foreground/80">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toLocaleString('es-AR')}</span>
                                </div>
                                <div className="flex justify-between text-foreground/80">
                                    <span>Envío</span>
                                    <span className={totalPrice > 50000 ? 'text-green-600 font-medium' : ''}>
                                        {totalPrice > 50000 ? 'Gratis' : 'Calculado'}
                                    </span>
                                </div>
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
                                {isProcessing ? 'Procesando...' : (
                                    <>
                                        {paymentMethod === 'mercadopago' ? <ShieldCheck className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                        {paymentMethod === 'mercadopago' ? 'Pagar con Mercado Pago' : 'Pagar de forma segura'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
