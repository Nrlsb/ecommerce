'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Importar Componentes Modulares
import { CartItemList } from '@/components/carrito/CartItemList';
import { ShippingForm } from '@/components/carrito/ShippingForm';
import { PaywayForm } from '@/components/carrito/PaywayForm';
import { CartSummary } from '@/components/carrito/CartSummary';

export default function CarritoPage() {
    const { items, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    
    // Estados principales
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'payway'>('mercadopago');
    const [showShippingForm, setShowShippingForm] = useState(false);

    // Estados de cupones
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // Estados de envío y facturación
    const [deliveryMethod, setDeliveryMethod] = useState<'envio' | 'retiro'>('envio');
    const [shippingData, setShippingData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        provincia: '',
        notes: ''
    });
    
    const [billingData, setBillingData] = useState({
        tipo: 'Consumidor Final',
        nombre: '',
        documento: ''
    });

    const [shippingCost, setShippingCost] = useState(0);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

    // Formulario de tarjeta Payway
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardHolderName: '',
        cardExpirationMonth: '',
        cardExpirationYear: '',
        securityCode: '',
        cardHolderIdentificationNumber: '',
        cardHolderIdentificationType: 'dni'
    });
    const [installments, setInstallments] = useState(1);
    const [paywayError, setPaywayError] = useState<string | null>(null);

    // Estado para validaciones de formulario visuales
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Calcular descuento
    let discountAmount = 0;
    if (appliedCoupon) {
        if (Number(appliedCoupon.descuento_porcentual) > 0) {
            discountAmount = Number(((totalPrice * Number(appliedCoupon.descuento_porcentual)) / 100).toFixed(2));
        } else if (Number(appliedCoupon.descuento_fijo) > 0) {
            discountAmount = Math.min(Number(appliedCoupon.descuento_fijo), totalPrice);
        }
    }
    const finalPrice = Math.max(0, totalPrice - discountAmount);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Cargar datos de perfil del usuario
    useEffect(() => {
        if (user) {
            setShippingData(prev => ({
                ...prev,
                email: user.email || prev.email,
                fullName: user.nombre || prev.fullName,
                phone: user.telefono || prev.phone,
                address: user.direccion || prev.address,
                city: user.ciudad || prev.city,
                zipCode: user.codigo_postal || prev.zipCode,
                provincia: user.provincia || prev.provincia
            }));

            // Fallback de carga del último pedido
            if (!user.telefono || !user.direccion || !user.provincia) {
                const fetchLastOrderShipping = async () => {
                    try {
                        const { data, error } = await supabase
                            .from('pedidos')
                            .select('cliente_nombre, envio_telefono, envio_direccion, envio_ciudad, envio_codigo_postal, envio_provincia')
                            .eq('cliente_email', user.email)
                            .order('created_at', { ascending: false })
                            .limit(1)
                            .maybeSingle();

                        if (data && !error) {
                            setShippingData(prev => ({
                                ...prev,
                                fullName: prev.fullName || data.cliente_nombre,
                                phone: prev.phone || data.envio_telefono,
                                address: prev.address || data.envio_direccion,
                                city: prev.city || data.envio_ciudad,
                                zipCode: prev.zipCode || data.envio_codigo_postal,
                                provincia: prev.provincia || data.envio_provincia,
                            }));
                        }
                    } catch (err) {
                        console.error('Error al cargar datos de envío previos del pedido:', err);
                    }
                };
                fetchLastOrderShipping();
            }
        }
    }, [user]);

    // Calcular costos de envío
    useEffect(() => {
        let active = true;

        const fetchShippingCost = async () => {
            if (deliveryMethod === 'retiro') {
                setShippingCost(0);
                setIsCalculatingShipping(false);
                return;
            }
            if (!shippingData.provincia) {
                setShippingCost(0);
                setIsCalculatingShipping(false);
                return;
            }

            setIsCalculatingShipping(true);
            try {
                const response = await fetch('/api/shipping-cost', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: items.map(item => ({ id: item.id, quantity: item.quantity })),
                        provincia: shippingData.provincia,
                        totalCompra: finalPrice
                    })
                });

                if (!active) return;

                if (response.ok) {
                    const data = await response.json();
                    setShippingCost(data.costoEnvio || 0);
                } else {
                    setShippingCost(8500); // Fallback
                }
            } catch (err) {
                if (!active) return;
                console.error('Error al conectar con API de envío:', err);
                setShippingCost(8500); // Fallback
            } finally {
                if (active) {
                    setIsCalculatingShipping(false);
                }
            }
        };

        fetchShippingCost();

        return () => {
            active = false;
        };
    }, [deliveryMethod, shippingData.provincia, items, finalPrice]);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplyingCoupon(true);
        setCouponError(null);
        try {
            const { data, error } = await supabase
                .from('cupones')
                .select('*')
                .eq('codigo', couponCode.toUpperCase().trim())
                .eq('activo', true)
                .single();

            if (error || !data) {
                setCouponError('Cupón inválido o inactivo.');
                setAppliedCoupon(null);
            } else {
                const ahora = new Date();
                const vencimiento = data.fecha_expiracion ? new Date(data.fecha_expiracion) : null;
                if (vencimiento && ahora > vencimiento) {
                    setCouponError('El cupón ha vencido.');
                    setAppliedCoupon(null);
                } else if (totalPrice < Number(data.compra_minima)) {
                    setCouponError(`Compra mínima requerida: $${Number(data.compra_minima).toLocaleString('es-AR')}`);
                    setAppliedCoupon(null);
                } else {
                    setAppliedCoupon(data);
                    setCouponError(null);
                }
            }
        } catch (err) {
            console.error('Error applying coupon:', err);
            setCouponError('Error al validar el cupón.');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError(null);
    };

    // Validación del Formulario de Envío y Facturación
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        
        if (!shippingData.fullName.trim()) errors.fullName = 'El nombre completo es requerido';
        if (!shippingData.email.trim()) {
            errors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(shippingData.email)) {
            errors.email = 'El formato de email es inválido';
        }
        if (!shippingData.phone.trim()) errors.phone = 'El teléfono es requerido';

        if (deliveryMethod === 'envio') {
            if (!shippingData.address.trim()) errors.address = 'La dirección de entrega es requerida';
            if (!shippingData.provincia) errors.provincia = 'Por favor selecciona una provincia';
        }

        if (billingData.tipo !== 'Consumidor Final') {
            if (!billingData.nombre.trim()) errors.billingNombre = 'La razón social de facturación es requerida';
            if (!billingData.documento.trim()) errors.billingDocumento = 'El CUIT/documento es requerido';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCheckout = async () => {
        if (!showShippingForm) {
            setShowShippingForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (!validateForm()) {
            // Scroll a los errores del formulario
            window.scrollTo({ top: 150, behavior: 'smooth' });
            return;
        }

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
                    cliente_nombre: shippingData.fullName,
                    cliente_email: shippingData.email,
                    cliente_telefono: shippingData.phone,
                    
                    metodo_entrega: deliveryMethod,
                    envio_direccion: shippingData.address,
                    envio_ciudad: shippingData.city,
                    envio_codigo_postal: shippingData.zipCode,
                    envio_provincia: shippingData.provincia,
                    envio_notas: shippingData.notes,
                    envio_costo: deliveryMethod === 'retiro' ? 0 : shippingCost,

                    facturacion_tipo: billingData.tipo,
                    facturacion_nombre: billingData.tipo === 'Consumidor Final' ? shippingData.fullName : billingData.nombre,
                    facturacion_documento: billingData.tipo === 'Consumidor Final' ? '' : billingData.documento,

                    metodo_pago: 'mercadopago',
                    cupon_codigo: appliedCoupon ? appliedCoupon.codigo : null
                })
            });

            const data = await response.json();

            if (response.ok && data.initPoint) {
                window.location.href = data.initPoint;
            } else if (response.ok) {
                clearCart();
                window.location.href = `/checkout/success?pedido_id=${data.pedidoId}`;
            } else {
                setPaywayError(data.error || 'Ocurrió un error con Mercado Pago');
            }
        } catch (e) {
            setPaywayError('Error de conexión con el servidor.');
        } finally {
            setIsProcessing(false);
        }
    };

    const isValidLuhn = (num: string) => {
        let sum = 0;
        let shouldDouble = false;
        for (let i = num.length - 1; i >= 0; i--) {
            let digit = parseInt(num.charAt(i), 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
    };

    const getPaymentMethodId = (bin: string) => {
        // Visa (Parametrizados: 1 para Crédito, 31 para Débito)
        const visaDebitoBins = ['451772', '451766', '451769', '451773', '402287', '402288', '402289', '440051', '451757', '451758'];
        if (bin.startsWith('4') && visaDebitoBins.some(prefix => bin.startsWith(prefix))) {
            return 31; // Visa Débito
        }
        if (bin.startsWith('4')) {
            return 1; // Visa Crédito
        }

        // MasterCard (Parametrizados: 104 para Crédito, 105 para Débito, 106 para Prepaga/Otros)
        const mcDebitoBins = ['5010', '5011', '5012', '5013', '5020', '5021', '5022', '5030', '5031', '5032', '5033', '5034', '5035', '5036', '5037', '5038', '5040', '5041', '5042', '5043', '5044', '5045', '5046', '5047', '5048', '5049', '5885'];
        if ((bin.startsWith('5') || bin.startsWith('2')) && mcDebitoBins.some(prefix => bin.startsWith(prefix))) {
            return 105; // MasterCard Débito
        }
        if (bin.startsWith('5') || bin.startsWith('2')) {
            return 104; // MasterCard Crédito
        }

        // American Express (Parametrizado: 111)
        if (bin.startsWith('3')) {
            return 111; // AMEX
        }

        // Discover (Parametrizado: 139)
        if (bin.startsWith('6')) {
            return 139; // Discover
        }

        return 1; // Default a Visa Crédito
    };

    const processPayway = () => {
        setIsProcessing(true);
        setPaywayError(null);
        try {
            const cardNumber = cardData.cardNumber.replace(/\s/g, '');
            if (!cardNumber || !cardData.securityCode || !cardData.cardHolderName) {
                setPaywayError('Por favor, complete todos los datos de la tarjeta.');
                setIsProcessing(false);
                return;
            }

            if (!isValidLuhn(cardNumber)) {
                setPaywayError('El número de tarjeta no es válido.');
                setIsProcessing(false);
                return;
            }

            const publicKey = process.env.NEXT_PUBLIC_PAYWAY_PUBLIC_KEY;
            if (!publicKey) {
                setPaywayError('La clave pública de Payway no está configurada.');
                setIsProcessing(false);
                return;
            }

            const decidirEnvUrl = process.env.NEXT_PUBLIC_PAYWAY_ENV === 'production' 
                ? 'https://ventasonline.payway.com.ar/api/v2' 
                : 'https://developers-ventasonline.payway.com.ar/api/v2';

            const dec = new (window as any).Decidir(decidirEnvUrl);
            dec.setPublishableKey(publicKey);
            dec.setTimeout(10000);

            const formElement = document.createElement('form');
            const appendField = (name: string, value: string) => {
                const input = document.createElement('input');
                input.setAttribute('data-decidir', name);
                input.value = value || '';
                formElement.appendChild(input);
            };

            appendField('card_number', cardNumber);
            appendField('card_expiration_month', cardData.cardExpirationMonth);
            appendField('card_expiration_year', cardData.cardExpirationYear);
            appendField('security_code', cardData.securityCode);
            appendField('card_holder_name', cardData.cardHolderName);
            appendField('card_holder_doc_type', cardData.cardHolderIdentificationType.toUpperCase());
            appendField('card_holder_doc_number', cardData.cardHolderIdentificationNumber);

            dec.createToken(formElement, async (status: number, response: any) => {
                if (status === 200 || status === 201) {
                    const paymentMethodId = getPaymentMethodId(response.bin || cardNumber.substring(0, 6));
                    await sendPaywayPayment(response.id, response.bin || cardNumber.substring(0, 6), paymentMethodId);
                } else {
                    console.error("Error al tokenizar con Payway:", response);
                    setPaywayError(response.error?.[0]?.error?.message || 'Verifique los datos ingresados de la tarjeta.');
                    setIsProcessing(false);
                }
            });
        } catch (error) {
            console.error('Error al inicializar Decidir:', error);
            setPaywayError('Ocurrió un error al conectar con Payway.');
            setIsProcessing(false);
        }
    };

    const sendPaywayPayment = async (token: string, bin: string, paymentMethodId: number) => {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    cliente_nombre: shippingData.fullName,
                    cliente_email: shippingData.email,
                    cliente_telefono: shippingData.phone,
                    
                    metodo_entrega: deliveryMethod,
                    envio_direccion: shippingData.address,
                    envio_ciudad: shippingData.city,
                    envio_codigo_postal: shippingData.zipCode,
                    envio_provincia: shippingData.provincia,
                    envio_notas: shippingData.notes,
                    envio_costo: deliveryMethod === 'retiro' ? 0 : shippingCost,

                    facturacion_tipo: billingData.tipo,
                    facturacion_nombre: billingData.tipo === 'Consumidor Final' ? shippingData.fullName : billingData.nombre,
                    facturacion_documento: billingData.tipo === 'Consumidor Final' ? '' : billingData.documento,

                    metodo_pago: 'payway',
                    payway_token: token,
                    bin: bin,
                    payment_method_id: paymentMethodId,
                    installments: installments,
                    cupon_codigo: appliedCoupon ? appliedCoupon.codigo : null
                })
            });

            const data = await response.json();

            if (response.ok && data.redirectUrl) {
                clearCart();
                window.location.href = data.redirectUrl;
            } else if (response.ok) {
                clearCart();
                window.location.href = `/checkout/success?pedido_id=${data.pedidoId}`;
            } else {
                setPaywayError('Error al procesar pago: ' + data.error);
            }
        } catch (e) {
            setPaywayError('Error de conexión con el servidor.');
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
        <div className="min-h-screen bg-muted/20 py-8 relative overflow-hidden">
            {/* Background Decorative Blurs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-mercurio-pink opacity-[0.04] rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-mercurio-blue opacity-[0.04] rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none"></div>

            <Script 
                src="https://ventasonline.payway.com.ar/static/v2.6.4/decidir.js" 
                strategy="lazyOnload" 
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-8">
                    <Link href="/catalogo" className="inline-flex items-center text-foreground/60 hover:text-primary transition-colors text-sm font-medium mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Seguir Comprando
                    </Link>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Tu Carrito</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Productos en el Carrito o Formulario de Envío */}
                    <div className="flex-1 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {showShippingForm ? (
                                <motion.div 
                                    key="shipping-flow"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="space-y-6"
                                >
                                    <ShippingForm 
                                        deliveryMethod={deliveryMethod}
                                        setDeliveryMethod={setDeliveryMethod}
                                        shippingData={shippingData}
                                        setShippingData={setShippingData}
                                        billingData={billingData}
                                        setBillingData={setBillingData}
                                        errors={formErrors}
                                        onBackToCart={() => setShowShippingForm(false)}
                                    />

                                    {paymentMethod === 'payway' && (
                                        <PaywayForm 
                                            cardData={cardData}
                                            setCardData={setCardData}
                                            installments={installments}
                                            setInstallments={setInstallments}
                                            paywayError={paywayError}
                                            finalPrice={finalPrice}
                                        />
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="cart-items"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    <CartItemList />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Resumen de Compra y Selección de Pago */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <CartSummary 
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            couponCode={couponCode}
                            setCouponCode={setCouponCode}
                            appliedCoupon={appliedCoupon}
                            couponError={couponError}
                            isApplyingCoupon={isApplyingCoupon}
                            onApplyCoupon={handleApplyCoupon}
                            onRemoveCoupon={handleRemoveCoupon}
                            totalPrice={totalPrice}
                            discountAmount={discountAmount}
                            shippingCost={deliveryMethod === 'retiro' ? 0 : shippingCost}
                            isCalculatingShipping={isCalculatingShipping}
                            installments={installments}
                            isProcessing={isProcessing}
                            onCheckout={handleCheckout}
                            showShippingForm={showShippingForm}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
