'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, PaintBucket, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductCalculator from '@/components/products/ProductCalculator';
import RoomSimulator from '@/components/products/RoomSimulator';
import ReviewSection from '@/components/products/ReviewSection';
import { supabase } from '@/lib/supabase';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const productId = resolvedParams.id;

    const [product, setProduct] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('productos')
                    .select('*')
                    .eq('id', productId)
                    .single();

                if (error) throw error;

                if (data) {
                    setProduct({
                        ...data,
                        rating: 4.8, // Fallback si no hay reseñas reales calculadas
                        reviewsCount: 0,
                        yield: data.rendimiento || 10 
                    });
                }
            } catch (error) {
                console.error('Error:', error instanceof Error ? error.message : String(error));
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            ...product,
            name: product.nombre,
            price: product.precio,
            brand: product.marca
        }, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-16 h-16 animate-spin text-primary" />
                    <p className="text-xs font-black uppercase tracking-widest text-primary/40">Cargando Experiencia...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">Producto no encontrado</h2>
                <Link href="/catalogo" className="text-primary hover:underline">Volver al catálogo</Link>
            </div>
        );
    }

    // Determinar un color representativo para el simulador
    const getProductColor = () => {
        if (product.hex_color) return product.hex_color;
        // Lógica simple para asignar colores basados en palabras clave del nombre
        const name = product.nombre.toLowerCase();
        if (name.includes('azul')) return '#1e40af';
        if (name.includes('rojo')) return '#991b1b';
        if (name.includes('verde')) return '#166534';
        if (name.includes('gris')) return '#374151';
        if (name.includes('amarillo')) return '#a16207';
        if (name.includes('blanco')) return '#f9fafb';
        return '#3b82f6'; // Azul por defecto de Mercurio
    };

    return (
        <div className="min-h-screen bg-background pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Link */}
                <Link href="/catalogo" className="inline-flex items-center text-foreground/40 hover:text-primary transition-colors mb-12 group font-black uppercase tracking-widest text-[10px]">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Catálogo de Productos
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Left: Product Media */}
                    <div className="sticky top-12 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-square bg-muted/30 rounded-[3rem] flex items-center justify-center border border-border overflow-hidden relative group/image shadow-2xl"
                        >
                            {product.imagen_url ? (
                                <img src={product.imagen_url} alt={product.nombre} className="w-full h-full object-contain p-12 group-hover:scale-110 transition-transform duration-1000" />
                            ) : (
                                <PaintBucket className="w-48 h-48 text-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                            )}
                            <div className="absolute top-8 left-8 bg-primary text-primary-foreground text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">
                                {product.marca || 'Pintura Premium'}
                            </div>
                        </motion.div>
                        
                        <div className="grid grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-muted/20 rounded-2xl border border-border/50 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer hover:border-primary/50">
                                    <PaintBucket className="w-8 h-8 text-foreground/20" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-12"
                        >
                            <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">{product.categoria_nombre || 'Nuestra Colección'}</p>
                            <h1 className="text-6xl font-black text-foreground mb-6 leading-[0.9] tracking-tighter">{product.nombre}</h1>
                            
                            <div className="flex items-center gap-6 mb-10">
                                <div className="flex items-center gap-1.5 text-amber-500">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={22} fill={s <= 4 ? "currentColor" : "none"} />
                                    ))}
                                    <span className="ml-2 font-black text-2xl text-foreground">4.8</span>
                                </div>
                                <div className="h-6 w-px bg-border" />
                                <span className="text-foreground/40 font-bold uppercase tracking-widest text-[10px]">Basado en 24 Opiniones</span>
                            </div>

                            <p className="text-2xl text-foreground/60 leading-tight font-medium mb-12 max-w-xl">
                                {product.descripcion || 'Una fórmula de alto rendimiento diseñada para transformar tus espacios con elegancia y durabilidad.'}
                            </p>
                        </motion.div>

                        {/* Price & Action Card */}
                        <div className="bg-muted/30 p-10 rounded-[3rem] border border-border/50 mb-12 shadow-inner relative overflow-hidden">
                            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-10 relative">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-foreground/40 font-black uppercase tracking-widest block">Inversión Profesional</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl font-black text-primary tracking-tighter">${Number(product.precio).toLocaleString('es-AR')}</span>
                                        <span className="text-sm font-bold text-foreground/40 uppercase">ARS</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center bg-background border-2 border-border/50 rounded-[1.5rem] p-1.5 shadow-xl">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-muted rounded-xl transition-all font-black text-2xl"
                                    >-</button>
                                    <span className="w-16 text-center font-black text-2xl tracking-tighter">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-muted rounded-xl transition-all font-black text-2xl"
                                    >+</button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={added}
                                className={`w-full py-6 rounded-[2rem] font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 transition-all transform active:scale-95 shadow-2xl relative ${added
                                    ? 'bg-green-500 text-white'
                                    : 'bg-primary text-primary-foreground hover:shadow-primary/30'
                                    }`}
                            >
                                {added ? (
                                    <>
                                        <Check className="w-7 h-7" /> ¡Listo! Agregado
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-7 h-7" /> Añadir al Carrito
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Features Badges */}
                        <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="flex items-center gap-4 p-6 bg-background border border-border/50 rounded-3xl shadow-sm group hover:border-primary/30 transition-colors">
                                <div className="p-3 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Truck className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block leading-none mb-1">Envío Express</span>
                                    <span className="text-sm font-black text-foreground/80">Entrega en 24hs</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-6 bg-background border border-border/50 rounded-3xl shadow-sm group hover:border-primary/30 transition-colors">
                                <div className="p-3 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block leading-none mb-1">Confianza</span>
                                    <span className="text-sm font-black text-foreground/80">Garantía Mercurio</span>
                                </div>
                            </div>
                        </div>

                        {/* Integrated Calculator */}
                        {product.yield > 0 && (
                            <ProductCalculator 
                                defaultYield={product.yield} 
                                onApplyQuantity={(qty) => setQuantity(qty)}
                            />
                        )}
                    </div>
                </div>

                {/* New: Room Simulator Section */}
                <RoomSimulator 
                    productName={product.nombre} 
                    productColor={getProductColor()} 
                />

                {/* New: Reviews Section */}
                <ReviewSection productId={product.id} />
            </div>
        </div>
    );
}
