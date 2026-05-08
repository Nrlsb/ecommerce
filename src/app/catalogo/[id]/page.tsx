'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, PaintBucket, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductCalculator from '@/components/products/ProductCalculator';
import RoomSimulator from '@/components/products/RoomSimulator';
import ReviewSection from '@/components/products/ReviewSection';
import VariantSelector from '@/components/products/VariantSelector';
import { supabase } from '@/lib/supabase';

// Caché persistente fuera del componente para evitar parpadeos en remounts de Next.js
const productCache = new Map<string, any>();
const variantsCache = new Map<string, any[]>();
let hasDoneInitialAnimation = false;

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const productId = resolvedParams.id;

    const [product, setProduct] = useState<any>(productCache.get(productId) || null);
    const [variants, setVariants] = useState<any[]>(variantsCache.get(productId) || []);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [isLoading, setIsLoading] = useState(!productCache.has(productId));
    const [showAnimation] = useState(!hasDoneInitialAnimation);

    useEffect(() => {
        if (!hasDoneInitialAnimation && product) {
            hasDoneInitialAnimation = true;
        }
    }, [product]);

    useEffect(() => {
        const fetchProductAndVariants = async () => {
            // 1. Verificar caché
            if (productCache.has(productId)) {
                setProduct(productCache.get(productId));
                setVariants(variantsCache.get(productId) || []);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const { data: currentProduct, error } = await supabase
                    .from('productos')
                    .select('*')
                    .eq('id', productId)
                    .single();

                if (error) throw error;

                if (currentProduct) {
                    const prodData = {
                        ...currentProduct,
                        rating: 4.8,
                        reviewsCount: 0,
                        yield: currentProduct.rendimiento || 10 
                    };
                    
                    let siblings: any[] = [];
                    if (currentProduct.familia_id) {
                        const { data } = await supabase
                            .from('productos')
                            .select('*')
                            .eq('familia_id', currentProduct.familia_id);
                        siblings = data || [];
                    } else {
                        const { data } = await supabase
                            .from('productos')
                            .select('*')
                            .eq('marca', currentProduct.marca)
                            .eq('categoria_id', currentProduct.categoria_id)
                            .limit(50);
                        siblings = data || [];
                    }

                    const parseName = (name: string) => {
                        const parts = name.split(/ [xX] /i);
                        const size = parts.length > 1 ? parts[1].trim() : '1';
                        return { nameBeforeSize: parts[0].trim(), size };
                    };

                    const currentParsed = parseName(currentProduct.nombre);
                    let filteredSiblings = siblings;
                    if (!currentProduct.familia_id) {
                        const baseWords = currentParsed.nameBeforeSize.split(' ').slice(0, 3).join(' ');
                        filteredSiblings = siblings.filter(s => s.nombre.toUpperCase().startsWith(baseWords.toUpperCase()));
                    }
                    
                    const processedVariants = filteredSiblings.map(s => {
                        const { size, nameBeforeSize } = parseName(s.nombre);
                        return { 
                            id: s.id, 
                            nombre: s.nombre, 
                            precio: s.precio,
                            size: size,
                            fullNameBeforeSize: nameBeforeSize,
                            fullProduct: { ...s, rating: 4.8, yield: s.rendimiento || 10 }
                        };
                    });

                    const names = processedVariants.map(v => v.fullNameBeforeSize);
                    let prefix = names[0] || '';
                    if (names.length > 1) {
                        for (let i = 1; i < names.length; i++) {
                            while (names[i].indexOf(prefix) !== 0) {
                                prefix = prefix.substring(0, prefix.lastIndexOf(' '));
                                if (prefix === '') break;
                            }
                        }
                    }
                    
                    const finalVariants = processedVariants.map(v => ({
                        ...v,
                        color: v.fullNameBeforeSize.replace(prefix, '').trim() || 'Estándar'
                    }));

                    // Guardar en caché TODAS las variantes encontradas para navegación instantánea
                    finalVariants.forEach(v => {
                        productCache.set(String(v.id), v.fullProduct);
                        variantsCache.set(String(v.id), finalVariants);
                    });

                    // Caso específico para el ID actual si no estaba en la lista (raro pero posible)
                    if (!productCache.has(productId)) {
                        productCache.set(productId, prodData);
                        variantsCache.set(productId, finalVariants);
                    }

                    setProduct(productCache.get(productId));
                    setVariants(finalVariants);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductAndVariants();
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

    if (isLoading && !product) {
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
                <Link href="/catalogo" className="inline-flex items-center text-foreground/40 hover:text-primary transition-all mb-12 group font-display font-bold uppercase tracking-[0.2em] text-[10px]">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" />
                    Catálogo de Productos
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Left: Product Media */}
                    <div className="sticky top-12 space-y-8">
                        <motion.div
                            initial={showAnimation ? { opacity: 0, scale: 0.95, y: 20 } : false}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="aspect-square bg-slate-50 dark:bg-slate-900/50 rounded-[3.5rem] flex items-center justify-center border border-slate-200/50 dark:border-slate-800/50 overflow-hidden relative group/image shadow-premium"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                            {product.imagen_url ? (
                                <img src={product.imagen_url} alt={product.nombre} className="w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                            ) : (
                                <PaintBucket className="w-48 h-48 text-foreground/5 animate-float" />
                            )}
                            <div className="absolute top-8 left-8 glass text-primary text-[10px] font-display font-bold px-5 py-2.5 rounded-full uppercase tracking-[0.2em] shadow-sm">
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
                            initial={showAnimation ? { opacity: 0, x: 30 } : false}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="mb-12"
                        >
                            <p className="text-xs font-display font-bold text-primary uppercase tracking-[0.4em] mb-4 opacity-70">{product.categoria_nombre || 'Nuestra Colección'}</p>
                            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-foreground mb-6 leading-[1.1] tracking-tight">{product.nombre}</h1>
                            
                            <div className="flex items-center gap-8 mb-10">
                                <div className="flex items-center gap-1.5 text-amber-400">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={20} fill={s <= 4 ? "currentColor" : "none"} strokeWidth={s <= 4 ? 0 : 2} />
                                    ))}
                                    <span className="ml-3 font-display font-bold text-2xl text-foreground">4.8</span>
                                </div>
                                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                                <span className="text-foreground/40 font-display font-bold uppercase tracking-[0.2em] text-[10px]">Basado en 24 Opiniones</span>
                            </div>

                            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-12 max-w-xl">
                                {product.descripcion || 'Una fórmula de alto rendimiento diseñada para transformar tus espacios con elegancia y durabilidad extrema.'}
                            </p>
                        </motion.div>

                        {/* Variant Selection (Color & Size) */}
                        <VariantSelector 
                            currentProductId={productId} 
                            variants={variants} 
                        />

                        {/* Price & Action Card */}
                        <div className="glass p-10 rounded-[3.5rem] border border-white/40 dark:border-white/5 mb-12 shadow-premium relative overflow-hidden">
                            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -left-20 -top-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-10 relative">
                                <div className="space-y-2">
                                    <span className="text-[10px] text-foreground/40 font-display font-bold uppercase tracking-[0.3em] block">Inversión Profesional</span>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-5xl lg:text-7xl font-display font-black text-primary tracking-tighter">${Number(product.precio).toLocaleString('es-AR')}</span>
                                        <span className="text-sm font-display font-bold text-foreground/40 uppercase tracking-widest">ARS</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-3xl p-2 shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-primary/5 rounded-2xl transition-all font-display font-bold text-xl active:scale-90"
                                    >-</button>
                                    <span className="w-16 text-center font-display font-black text-2xl tracking-tighter">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-primary/5 rounded-2xl transition-all font-display font-bold text-xl active:scale-90"
                                    >+</button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={added}
                                className={`w-full py-6 rounded-[2.5rem] font-display font-extrabold text-lg uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all transform active:scale-[0.98] shadow-xl relative overflow-hidden group ${added
                                    ? 'bg-green-500 text-white shadow-green-200 dark:shadow-green-900/20'
                                    : 'bg-primary text-primary-foreground hover:shadow-primary/30 hover:-translate-y-1'
                                    }`}
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {added ? (
                                    <>
                                        <Check className="w-6 h-6" /> ¡Agregado!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" /> Añadir al Carrito
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Features Badges */}
                        <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="flex items-center gap-5 p-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] shadow-sm group hover:border-primary/30 transition-all hover:shadow-premium">
                                <div className="p-4 bg-primary/5 rounded-2xl group-hover:scale-110 transition-transform group-hover:bg-primary/10">
                                    <Truck className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-display font-bold text-foreground/30 uppercase tracking-[0.2em] block leading-none mb-1.5">Envío Express</span>
                                    <span className="text-sm font-display font-extrabold text-foreground/80">Entrega en 24hs</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 p-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] shadow-sm group hover:border-primary/30 transition-all hover:shadow-premium">
                                <div className="p-4 bg-primary/5 rounded-2xl group-hover:scale-110 transition-transform group-hover:bg-primary/10">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-display font-bold text-foreground/30 uppercase tracking-[0.2em] block leading-none mb-1.5">Confianza</span>
                                    <span className="text-sm font-display font-extrabold text-foreground/80">Garantía Mercurio</span>
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
