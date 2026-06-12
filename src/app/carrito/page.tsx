'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function CarritoPage() {
    const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'payway'>('mercadopago');

    // Coupon states
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // Estado para formulario Payway (Decidir)
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

    // Estado para envío/retiro
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
    const [showShippingForm, setShowShippingForm] = useState(false);

    // Estado para facturación
    const [billingData, setBillingData] = useState({
        tipo: 'Consumidor Final',
        nombre: '',
        documento: ''
    });

    // Costo de envío dinámico
    const [shippingCost, setShippingCost] = useState(0);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

    // Calcular descuento y precio final
    let discountAmount = 0;
    if (appliedCoupon) {
        if (Number(appliedCoupon.descuento_porcentual) > 0) {
            discountAmount = Number(((totalPrice * Number(appliedCoupon.descuento_porcentual)) / 100).toFixed(2));
        } else if (Number(appliedCoupon.descuento_fijo) > 0) {
            discountAmount = Math.min(Number(appliedCoupon.descuento_fijo), totalPrice);
        }
    }
    const finalPrice = Math.max(0, totalPrice - discountAmount);

    let recargoMult = 1;
    if (paymentMethod === 'payway') {
        if (installments === 3) recargoMult = 1.15;
        else if (installments === 6) recargoMult = 1.30;
        else if (installments === 12) recargoMult = 1.60;
    }
    const totalConRecargo = (finalPrice + shippingCost) * recargoMult;

    // Pre-cargar datos del usuario y dirección del perfil o del último pedido si tiene la sesión iniciada
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

            // Si faltan datos en el perfil, buscar como fallback en el último pedido realizado
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

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Efecto para calcular costo de envío dinámico
    useEffect(() => {
        const fetchShippingCost = async () => {
            if (deliveryMethod === 'retiro') {
                setShippingCost(0);
                return;
            }

            const finalPriceBase = totalPrice - discountAmount;
            /*
            if (finalPriceBase >= 50000) {
                setShippingCost(0);
                return;
            }
            */

            if (!shippingData.provincia) {
                setShippingCost(0);
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
                        totalCompra: finalPriceBase
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    setShippingCost(data.costoEnvio || 0);
                } else {
                    console.error('Error calculando costo de envío');
                    setShippingCost(8500); // Fallback
                }
            } catch (err) {
                console.error('Error al conectar con API de envío:', err);
                setShippingCost(8500); // Fallback
            } finally {
                setIsCalculatingShipping(false);
            }
        };

        fetchShippingCost();
    }, [deliveryMethod, shippingData.provincia, items, totalPrice, discountAmount]);

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

    const handleCheckout = async () => {
        if (!showShippingForm) {
            setShowShippingForm(true);
            // Scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Validar datos de envío
        if (!shippingData.fullName || !shippingData.email || !shippingData.phone) {
            alert('Por favor, complete todos los campos obligatorios de contacto.');
            return;
        }

        if (deliveryMethod === 'envio') {
            if (!shippingData.address || !shippingData.provincia) {
                alert('Por favor, complete la dirección y provincia de entrega.');
                return;
            }
        }

        // Validar datos de facturación
        if (billingData.tipo !== 'Consumidor Final') {
            if (!billingData.nombre || !billingData.documento) {
                alert('Por favor, complete la razón social y CUIT/documento de facturación.');
                return;
            }
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
                    
                    // Datos de Envío / Entrega
                    metodo_entrega: deliveryMethod,
                    envio_direccion: shippingData.address,
                    envio_ciudad: shippingData.city,
                    envio_codigo_postal: shippingData.zipCode,
                    envio_provincia: shippingData.provincia,
                    envio_notas: shippingData.notes,
                    envio_costo: shippingCost,

                    // Datos de Facturación
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

    const isValidLuhn = (num: string) => {
        let sum = 0;
        let shouldDouble = false;
        // Loop from right to left
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
        // Mapeo específico para tarjetas de prueba de Payway (según su planilla Excel)
        if (bin.startsWith('451772')) return 31; // Visa Débito
        if (bin.startsWith('450799') || bin.startsWith('454640') || bin.startsWith('425821')) return 1; // Visa Crédito
        
        if (bin.startsWith('529991') || bin.startsWith('545533') || bin.startsWith('520423')) return 104; // MasterCard Payway
        if (bin.startsWith('589657')) return 63; // Cabal Payway

        // Fallbacks genéricos por si no coincide con las tarjetas de prueba
        if (bin.startsWith('4')) return 1; // Visa Crédito genérico
        if (bin.startsWith('5')) return 15; // Mastercard genérico
        if (bin.startsWith('3')) return 65; // Amex genérico
        return 1; // default
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
                setPaywayError('La clave pública de Payway no está configurada en el servidor/Vercel (NEXT_PUBLIC_PAYWAY_PUBLIC_KEY).');
                setIsProcessing(false);
                return;
            }

            const decidirEnvUrl = process.env.NEXT_PUBLIC_PAYWAY_ENV === 'production' 
                ? 'https://ventasonline.payway.com.ar/api/v2' 
                : 'https://developers-ventasonline.payway.com.ar/api/v2';

            const dec = new (window as any).Decidir(decidirEnvUrl);
            dec.setPublishableKey(publicKey);
            dec.setTimeout(10000);

            // Crear un formulario virtual en memoria ya que decidir.js requiere un objeto con querySelectorAll
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
            appendField('card_holder_doc_type', cardData.cardHolderIdentificationType);
            appendField('card_holder_doc_number', cardData.cardHolderIdentificationNumber);

            dec.createToken(formElement, async (status: number, response: any) => {
                if (status === 200 || status === 201) {
                    const paymentMethodId = getPaymentMethodId(response.bin || cardNumber.substring(0, 6));
                        
                    await sendPaywayPayment(response.id, response.bin || cardNumber.substring(0, 6), paymentMethodId);
                } else {
                    console.error("Error al tokenizar con Payway:", response);
                    setPaywayError(response.error?.[0]?.error?.message || 'Verifique los datos ingresados.');
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
                    cliente_nombre: shippingData.fullName || cardData.cardHolderName || 'Cliente Web',
                    cliente_email: shippingData.email || 'cliente@ejemplo.com',
                    cliente_telefono: shippingData.phone,
                    
                    // Datos de Envío / Entrega
                    metodo_entrega: deliveryMethod,
                    envio_direccion: shippingData.address,
                    envio_ciudad: shippingData.city,
                    envio_codigo_postal: shippingData.zipCode,
                    envio_provincia: shippingData.provincia,
                    envio_notas: shippingData.notes,
                    envio_costo: shippingCost,

                    // Datos de Facturación
                    facturacion_tipo: billingData.tipo,
                    facturacion_nombre: billingData.tipo === 'Consumidor Final' ? (shippingData.fullName || cardData.cardHolderName) : billingData.nombre,
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
                // Caso alternativo si no hay redirect
                clearCart();
                window.location.href = `/checkout/success?pedido_id=${data.pedidoId}`;
            } else {
                setPaywayError('Error al procesar pago: ' + data.error);
            }
        } catch (e) {
            setPaywayError('Error de conexión: ' + (e instanceof Error ? e.message : String(e)));
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
            <Script 
                src="https://ventasonline.payway.com.ar/static/v2.6.4/decidir.js" 
                strategy="lazyOnload" 
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/catalogo" className="inline-flex items-center text-foreground/60 hover:text-primary transition-colors text-sm font-medium mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Seguir Comprando
                    </Link>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Tu Carrito</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Productos en el Carrito o Formulario de Envío */}
                    <div className="flex-1 space-y-6">
                        {showShippingForm ? (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-card border border-border p-8 rounded-[2rem] shadow-sm space-y-8"
                            >
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <h2 className="text-2xl font-black text-foreground">Datos de Entrega</h2>
                                    <button 
                                        onClick={() => setShowShippingForm(false)}
                                        className="text-primary font-bold text-sm hover:underline"
                                    >
                                        Editar productos
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setDeliveryMethod('envio')}
                                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${deliveryMethod === 'envio' ? 'border-primary bg-primary/5' : 'border-border opacity-50 hover:opacity-100'}`}
                                    >
                                        <Truck className="w-8 h-8 text-primary" />
                                        <span className="font-bold">Envío a domicilio</span>
                                    </button>
                                    <button 
                                        onClick={() => setDeliveryMethod('retiro')}
                                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${deliveryMethod === 'retiro' ? 'border-primary bg-primary/5' : 'border-border opacity-50 hover:opacity-100'}`}
                                    >
                                        <ShieldCheck className="w-8 h-8 text-primary" />
                                        <span className="font-bold">Retiro en sucursal</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Nombre Completo *</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                                            value={shippingData.fullName}
                                            onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                                            placeholder="Juan Pérez"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Email *</label>
                                        <input 
                                            type="email" 
                                            required
                                            className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                                            value={shippingData.email}
                                            onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                                            placeholder="juan@ejemplo.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Teléfono *</label>
                                        <input 
                                            type="tel" 
                                            required
                                            className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                                            value={shippingData.phone}
                                            onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                                            placeholder="11 1234-5678"
                                        />
                                    </div>

                                    {deliveryMethod === 'envio' && (
                                        <>
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Dirección de Entrega *</label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                                                    value={shippingData.address}
                                                    onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                                                    placeholder="Calle 123, Piso 1, Depto A"
                                                />
                                            </div>
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Provincia *</label>
                                                <select
                                                    required
                                                    className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                                                    value={shippingData.provincia}
                                                    onChange={(e) => setShippingData({...shippingData, provincia: e.target.value})}
                                                >
                                                    <option value="">Selecciona tu provincia...</option>
                                                    <option value="caba">CABA (Ciudad Autónoma de Buenos Aires)</option>
                                                    <option value="buenos_aires">Buenos Aires (Provincia)</option>
                                                    <option value="catamarca">Catamarca</option>
                                                    <option value="chaco">Chaco</option>
                                                    <option value="chubut">Chubut</option>
                                                    <option value="cordoba">Córdoba</option>
                                                    <option value="corrientes">Corrientes</option>
                                                    <option value="entre_rios">Entre Ríos</option>
                                                    <option value="formosa">Formosa</option>
                                                    <option value="jujuy">Jujuy</option>
                                                    <option value="la_pampa">La Pampa</option>
                                                    <option value="la_rioja">La Rioja</option>
                                                    <option value="mendoza">Mendoza</option>
                                                    <option value="misiones">Misiones</option>
                                                    <option value="neuquen">Neuquén</option>
                                                    <option value="rio_negro">Río Negro</option>
                                                    <option value="salta">Salta</option>
                                                    <option value="san_juan">San Juan</option>
                                                    <option value="san_luis">San Luis</option>
                                                    <option value="santa_cruz">Santa Cruz</option>
                                                    <option value="santa_fe">Santa Fe</option>
                                                    <option value="santiago_del_estero">Santiago del Estero</option>
                                                    <option value="tierra_del_fuego">Tierra del Fuego</option>
                                                    <option value="tucuman">Tucumán</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Ciudad</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                                                    value={shippingData.city}
                                                    onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                                                    placeholder="Ej. CABA / Tandil"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Código Postal</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                                                    value={shippingData.zipCode}
                                                    onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                                                    placeholder="1425"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="col-span-1 md:col-span-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Notas adicionales (opcional)</label>
                                        <textarea 
                                            rows={3}
                                            className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors resize-none"
                                            value={shippingData.notes}
                                            onChange={(e) => setShippingData({...shippingData, notes: e.target.value})}
                                            placeholder="Indicaciones para el repartidor..."
                                        />
                                    </div>
                                </div>

                                {/* Datos de Facturación */}
                                <div className="border-t border-border pt-6 mt-6">
                                    <h3 className="text-lg font-bold text-foreground mb-4">Datos de Facturación</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Tipo de Factura</label>
                                            <select
                                                className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                                                value={billingData.tipo}
                                                onChange={(e) => setBillingData({...billingData, tipo: e.target.value})}
                                            >
                                                <option value="Consumidor Final">Consumidor Final</option>
                                                <option value="Factura A">Factura A (Responsable Inscripto)</option>
                                                <option value="Factura B">Factura B</option>
                                            </select>
                                        </div>
                                        
                                        {billingData.tipo !== 'Consumidor Final' && (
                                            <>
                                                <div>
                                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">
                                                        {billingData.tipo === 'Factura A' ? 'Razón Social *' : 'Nombre Completo / Razón Social *'}
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        required
                                                        className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                                                        value={billingData.nombre}
                                                        onChange={(e) => setBillingData({...billingData, nombre: e.target.value})}
                                                        placeholder="Ej. Pinturerías Mercurio S.A."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">
                                                        {billingData.tipo === 'Factura A' ? 'CUIT *' : 'CUIT / CUIL / DNI *'}
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        required
                                                        className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                                                        value={billingData.documento}
                                                        onChange={(e) => setBillingData({...billingData, documento: e.target.value})}
                                                        placeholder="30-12345678-9"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            items.map((item: any) => (
                                <div key={item.id} className="bg-card border border-border p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-sm">
                                    <div className="w-full sm:w-24 h-24 bg-muted dark:bg-slate-900/50 rounded-xl flex items-center justify-center flex-shrink-0 p-2 relative overflow-hidden">
                                        {item.imagen_url ? (
                                            <img 
                                                src={item.imagen_url} 
                                                alt={item.name} 
                                                className="w-full h-full object-contain rounded-lg" 
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <img 
                                                    src="/images/logos/logomercurio.png" 
                                                    alt="Sin imagen" 
                                                    className="w-12 h-auto opacity-20 mb-1" 
                                                />
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/30">{item.brand || 'Mercurio'}</span>
                                            </div>
                                        )}
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
                            ))
                        )}
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
                                    <div className="flex gap-4">
                                        <div className="w-1/3">
                                            <label className="text-xs font-semibold text-foreground/70 mb-1 block">Tipo Doc</label>
                                            <select 
                                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                                value={cardData.cardHolderIdentificationType}
                                                onChange={(e) => setCardData({...cardData, cardHolderIdentificationType: e.target.value})}
                                            >
                                                <option value="dni">DNI</option>
                                                <option value="pasaporte">Pasaporte</option>
                                                <option value="cuil">CUIL</option>
                                                <option value="cuit">CUIT</option>
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-semibold text-foreground/70 mb-1 block">Número de Documento</label>
                                            <input 
                                                type="text" 
                                                placeholder="Sin puntos ni espacios" 
                                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                                value={cardData.cardHolderIdentificationNumber}
                                                onChange={(e) => setCardData({...cardData, cardHolderIdentificationNumber: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-foreground/70 mb-1 block">Cuotas</label>
                                        <select 
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                            value={installments}
                                            onChange={(e) => setInstallments(Number(e.target.value))}
                                        >
                                            <option value={1}>1 Cuota sin interés de ${((finalPrice + shippingCost)).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</option>
                                            <option value={3}>3 Cuotas fijas de ${((finalPrice + shippingCost) * 1.15 / 3).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u (15% recargo)</option>
                                            <option value={6}>6 Cuotas fijas de ${((finalPrice + shippingCost) * 1.30 / 6).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u (30% recargo)</option>
                                            <option value={12}>12 Cuotas fijas de ${((finalPrice + shippingCost) * 1.60 / 12).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u (60% recargo)</option>
                                        </select>
                                    </div>
                                    {paywayError && (
                                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 font-medium">
                                            {paywayError}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Coupon Input */}
                            <div className="border-t border-border pt-4 mb-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">Cupón de Descuento</label>
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between bg-mercurio-green/10 border border-mercurio-green/20 text-slate-900 dark:text-slate-100 p-3 rounded-xl">
                                        <div>
                                            <p className="text-sm font-bold">{appliedCoupon.codigo}</p>
                                            <p className="text-xs text-foreground/70">
                                                {appliedCoupon.descuento_porcentual > 0 
                                                    ? `${appliedCoupon.descuento_porcentual}% OFF` 
                                                    : `$${Number(appliedCoupon.descuento_fijo).toLocaleString('es-AR')} OFF`
                                                }
                                            </p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="text-xs font-bold uppercase tracking-widest text-red-500 hover:underline hover:scale-105 active:scale-95 transition-all"
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Ingresa tu cupón" 
                                            className="flex-1 px-3 py-2 bg-background border border-border rounded-xl text-sm uppercase outline-none focus:border-primary transition-colors"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                        />
                                        <button 
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={isApplyingCoupon}
                                            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            {isApplyingCoupon ? '...' : 'Aplicar'}
                                        </button>
                                    </div>
                                )}
                                {couponError && (
                                    <p className="text-red-500 text-xs mt-2 font-medium">{couponError}</p>
                                )}
                            </div>

                              <h2 className="text-lg font-bold border-t border-border pt-4 mb-4">Resumen</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-foreground/80">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toLocaleString('es-AR')}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600 font-bold">
                                        <span>Descuento ({appliedCoupon?.codigo})</span>
                                        <span>-${discountAmount.toLocaleString('es-AR')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-foreground/80">
                                    <span>Envío</span>
                                    <span className={deliveryMethod === 'retiro' ? 'text-green-600 font-medium' : ''}>
                                        {deliveryMethod === 'retiro' ? 'Gratis (Retiro)' : (
                                            isCalculatingShipping ? 'Calculando...' : (
                                                shippingCost > 0 ? `$${shippingCost.toLocaleString('es-AR')}` : 'Selecciona provincia'
                                            )
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-border pt-4 mb-6">
                                {paymentMethod === 'payway' && installments > 1 && (
                                    <div className="flex justify-between text-sm text-foreground/80 mb-2">
                                        <span>Recargo por financiación ({installments === 3 ? '15%' : installments === 6 ? '30%' : '60%'})</span>
                                        <span>+${((finalPrice + shippingCost) * (recargoMult - 1)).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold">Total</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-primary block">
                                            ${totalConRecargo.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        {paymentMethod === 'payway' && installments > 1 && (
                                            <span className="text-xs text-foreground/60 block mt-1">
                                                {installments} cuotas fijas de ${((finalPrice + shippingCost) * recargoMult / installments).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing || isCalculatingShipping}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/95 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/10 hover:shadow-primary/20 disabled:opacity-50"
                            >
                                {isProcessing ? 'Procesando...' : (isCalculatingShipping ? 'Calculando envío...' : (!showShippingForm ? 'Continuar con el envío' : (
                                    <>
                                        {paymentMethod === 'mercadopago' ? <ShieldCheck className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                        {paymentMethod === 'mercadopago' ? 'Pagar con Mercado Pago' : 'Pagar de forma segura'}
                                    </>
                                )))}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
