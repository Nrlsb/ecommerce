'use client';

import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/catalogo/ProductCard';
import { useCart } from '@/context/CartContext';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

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
        <div className="min-h-screen bg-muted/20 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-4">
                        Mis Favoritos <Heart className="text-red-500 w-8 h-8" fill="currentColor" />
                    </h1>
                    <p className="text-foreground/60 mt-2 text-lg">Guarda los colores y productos que más te gustan para tu próximo proyecto.</p>
                </div>

                {wishlist.length === 0 ? (
                    <div className="bg-card border border-border rounded-[3rem] p-16 text-center shadow-sm">
                        <div className="bg-muted p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
                            <Heart className="w-12 h-12 text-foreground/20" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Tu lista está vacía</h3>
                        <p className="text-foreground/60 mb-10 max-w-md mx-auto text-lg">¡No te quedes sin inspiración! Explora nuestro catálogo y guarda lo que te guste.</p>
                        <Link href="/catalogo" className="bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-bold hover:shadow-xl transition-all inline-flex items-center gap-3">
                            Ir al Catálogo <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {wishlist.map((product, idx) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                delay={idx * 0.1} 
                                onAddToCart={handleAddToCart} 
                            />
                        ))}
                    </div>
                )}

                {wishlist.length > 0 && (
                    <div className="mt-16 p-10 bg-primary/5 rounded-[3rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-foreground">¿Listo para empezar?</h3>
                            <p className="text-foreground/60">Agrega tus favoritos al carrito y recibe todo en 24hs.</p>
                        </div>
                        <Link href="/catalogo" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2">
                            Ver más productos <ShoppingBag className="w-5 h-5" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
