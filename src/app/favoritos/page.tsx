'use client';

import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/catalogo/ProductCard';
import { useCart } from '@/context/CartContext';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FavoritosPage() {
    const { wishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (product: any) => {
        const finalPrice = product.precio_con_descuento && Number(product.precio_con_descuento) < Number(product.precio)
            ? Number(product.precio_con_descuento)
            : Number(product.precio);
        addToCart({
            ...product,
            name: product.nombre,
            price: finalPrice,
            brand: product.marca,
            quantity: 1,
        });
    };

    return (
        <div className="min-h-screen bg-muted/20 py-16 relative overflow-hidden">
            {/* Background Decorative Blurs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-mercurio-pink opacity-[0.04] rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-mercurio-blue opacity-[0.04] rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-4">
                        Mis Favoritos 
                        <motion.span 
                            animate={{ scale: [1, 1.15, 1] }} 
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="inline-block"
                        >
                            <Heart className="text-mercurio-pink w-9 h-9" fill="currentColor" />
                        </motion.span>
                    </h1>
                    <p className="text-foreground/60 mt-2 text-lg font-light">Guarda los colores y productos que más te gustan para tu próximo proyecto.</p>
                </div>

                {wishlist.length === 0 ? (
                    <div className="bg-card border border-border shadow-premium rounded-[2.5rem] p-16 text-center max-w-2xl mx-auto relative overflow-hidden premium-border-hover">
                        {/* Internal Glow */}
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-tr from-mercurio-pink/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                        
                        <motion.div 
                            animate={{
                                y: [0, -12, 0],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="bg-mercurio-pink/10 border border-mercurio-pink/20 p-6 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-inner"
                        >
                            <Heart className="w-12 h-12 text-mercurio-pink" fill="none" strokeWidth={1.5} />
                        </motion.div>
                        <h3 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tight">Tu lista está vacía</h3>
                        <p className="text-foreground/60 mb-10 max-w-md mx-auto text-sm leading-relaxed font-light">
                            ¡No te quedes sin inspiración! Explora nuestro catálogo y guarda los productos técnicos y de color que más te gusten.
                        </p>
                        <Link href="/catalogo" className="bg-accent text-accent-foreground px-10 py-4 rounded-full font-black tracking-widest text-xs uppercase hover:shadow-xl transition-all inline-flex items-center gap-2.5 hover:scale-105 active:scale-95 btn-premium-glow btn-premium-glow-pink">
                            Ir al Catálogo <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {wishlist.map((product, idx) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                delay={idx * 0.08} 
                                onAddToCart={handleAddToCart} 
                            />
                        ))}
                    </div>
                )}

                {wishlist.length > 0 && (
                    <div className="mt-16 p-10 bg-white/40 dark:bg-slate-900/20 rounded-[2.5rem] border border-border flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
                        <div className="space-y-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-foreground">¿Listo para empezar?</h3>
                            <p className="text-foreground/60 text-sm font-light">Agregá tus favoritos al carrito y recibí todo en 24hs.</p>
                        </div>
                        <Link href="/catalogo" className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                            Ver más productos <ShoppingBag className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
