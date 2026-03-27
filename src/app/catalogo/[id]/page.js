'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, PaintBucket, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductCalculator from '@/components/products/ProductCalculator';
import { supabase } from '@/lib/supabase';

export default function ProductDetail({ params }) {
    const resolvedParams = use(params);
    const productId = resolvedParams.id;

    const [product, setProduct] = useState(null);
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

                if (data) {
                    setProduct({
                        ...data,
                        rating: 4.8, // Mock
                        reviews: 124, // Mock
                        yield: data.rendimiento || 10 // Usar el campo de la DB
                    });
                }
            } catch (error) {
                console.error('Error:', error);
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
            name: product.nombre, // Compatibilidad con el carrito existente
            price: product.precio,
            brand: product.marca
        }, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
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

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Link */}
                <Link href="/catalogo" className="inline-flex items-center text-foreground/60 hover:text-primary transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al catálogo
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Image Gallery (Mock) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                    >
                        <div className="aspect-square bg-muted rounded-3xl flex items-center justify-center border border-border overflow-hidden relative group">
                            {product.imagen_url ? (
                                <img src={product.imagen_url} alt={product.nombre} className="w-full h-full object-contain" />
                            ) : (
                                <PaintBucket className="w-32 h-32 text-foreground/10 group-hover:scale-110 transition-transform duration-700" />
                            )}
                            <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                {product.category || 'Pintura'}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-muted rounded-xl border border-border flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                                    <PaintBucket className="w-6 h-6 text-foreground/20" />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">{product.marca || 'Pinturería Mercurio'}</p>
                            <h1 className="text-4xl font-black text-foreground mb-4 leading-tight">{product.nombre}</h1>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1 text-amber-500">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={18} fill={s <= Math.floor(product.rating) ? "currentColor" : "none"} />
                                    ))}
                                    <span className="ml-2 font-bold text-foreground">{product.rating}</span>
                                </div>
                                <span className="text-foreground/40 font-medium">({product.reviews} reseñas)</span>
                            </div>
                            <p className="text-xl text-foreground/70 leading-relaxed mb-8">
                                {product.descripcion}
                            </p>
                        </div>

                        <div className="bg-muted/30 p-8 rounded-3xl border border-border mb-8">
                            <div className="flex items-end justify-between mb-8">
                                <div>
                                    <span className="text-sm text-foreground/40 font-bold uppercase block mb-1">Precio Unitario</span>
                                    <span className="text-4xl font-black text-primary">${Number(product.precio).toLocaleString('es-AR')}</span>
                                </div>
                                <div className="flex items-center bg-background border border-border rounded-xl p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-lg transition-colors font-bold text-lg"
                                    >-</button>
                                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-lg transition-colors font-bold text-lg"
                                    >+</button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={added}
                                className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 ${added
                                    ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                                    : 'bg-primary text-primary-foreground hover:shadow-[0_10px_20px_rgba(var(--primary-rgb),0.3)]'
                                    }`}
                            >
                                {added ? (
                                    <>
                                        <Check className="w-6 h-6" /> Agregado al Carrito
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-6 h-6" /> Añadir al Carrito
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Features List */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 p-4 bg-background border border-border rounded-2xl">
                                <Truck className="w-5 h-5 text-primary" />
                                <span className="text-sm font-bold text-foreground/70">Envío 24hs</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-background border border-border rounded-2xl">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                <span className="text-sm font-bold text-foreground/70">Garantía Oficial</span>
                            </div>
                        </div>

                        {/* Integrated Calculator */}
                        {product.yield > 0 && (
                            <ProductCalculator defaultYield={product.yield} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
