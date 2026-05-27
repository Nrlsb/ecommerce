'use client';

import { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, Send, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ArrepentimientoForm() {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        orderNumber: '',
        name: '',
        email: '',
        phone: '',
        reason: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const orderId = searchParams.get('pedido_id') || searchParams.get('order_id') || '';
        const name = searchParams.get('nombre') || searchParams.get('name') || '';
        const email = searchParams.get('email') || '';
        const phone = searchParams.get('telefono') || searchParams.get('phone') || '';

        setFormData({
            orderNumber: orderId,
            name: name,
            email: email,
            phone: phone,
            reason: ''
        });
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        try {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            const isUuid = uuidRegex.test(formData.orderNumber);

            const res = await fetch('/api/arrepentimiento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pedidoId: isUuid ? formData.orderNumber : null,
                    pedidoNumero: formData.orderNumber,
                    nombre: formData.name,
                    email: formData.email,
                    telefono: formData.phone,
                    motivo: formData.reason
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSubmitted(true);
            } else {
                throw new Error(data.error || 'Error al procesar la solicitud');
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado al enviar la solicitud.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-muted/20 py-20 px-4">
                <div className="max-w-2xl mx-auto bg-card border border-border p-8 md:p-12 rounded-3xl text-center shadow-lg">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 mx-auto rounded-full flex items-center justify-center mb-6">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-foreground mb-4 uppercase tracking-tight">Solicitud Recibida</h1>
                    <p className="text-foreground/70 mb-8 text-lg">
                        Hemos recibido tu solicitud de arrepentimiento/devolución para el pedido <strong>#{formData.orderNumber}</strong>. 
                        Te hemos enviado un correo electrónico de confirmación con el número de gestión. 
                        Nuestro equipo se pondrá en contacto contigo en un plazo máximo de 48 horas hábiles.
                    </p>
                    <Link href="/" className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors uppercase tracking-widest text-sm">
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-foreground/60 hover:text-primary transition-colors text-sm font-medium mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight uppercase">Botón de Arrepentimiento</h1>
                    <p className="text-foreground/70 text-lg">
                        De acuerdo a la Ley de Defensa del Consumidor, tienes 10 días corridos para revocar tu compra desde que recibiste el producto o celebraste el contrato, lo último que ocurra.
                    </p>
                </div>

                <div className="bg-card border border-border rounded-[2rem] p-6 md:p-10 shadow-sm">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3 mb-8">
                        <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm">Información Importante</h3>
                            <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">
                                Los costos de envío por la devolución del producto estarán a cargo de Mercurio Pinturerías. El producto debe encontrarse sin uso, en perfectas condiciones y con sus embalajes originales.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest">Número de Pedido (*)</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.orderNumber}
                                    onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                                    placeholder="Ej: PED-123456"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest">Nombre Completo (*)</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Ej: Juan Pérez"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest">Email (*)</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    placeholder="correo@ejemplo.com"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest">Teléfono (*)</label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    placeholder="Ej: 11 1234-5678"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest">Motivo (Opcional)</label>
                            <textarea
                                rows={4}
                                value={formData.reason}
                                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                placeholder="Nos ayuda a mejorar conocer el motivo de tu revocación..."
                                className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors font-medium resize-none"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 flex items-center gap-3 text-sm font-bold">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-foreground text-background font-bold rounded-xl hover:bg-primary hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-2 mt-8 disabled:opacity-50 shadow-md"
                        >
                            {isSubmitting ? 'Enviando...' : (
                                <>
                                    <Send size={18} />
                                    Enviar Solicitud
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ArrepentimientoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-muted/20 py-20 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        }>
            <ArrepentimientoForm />
        </Suspense>
    );
}

