'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Star, Heart, Share2, PaintBucket, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCart } from '@/context/CartContext';

// Simulated database
const mockProducts = [
    { id: 1, name: 'Látex Interior Premium 20L', brand: 'ColorMaster', category: 'interior', price: 45000, rating: 4.8, description: 'Pintura látex de máxima calidad para interiores. Excelente cubritivo, lavable y con acabado mate perfecto. Ideal para living, dormitorios y pasillos.', stock: 15 },
    { id: 2, name: 'Esmalte Sintético Brillante 4L', brand: 'BrilloMax', category: 'esmaltes', price: 22000, rating: 4.5, description: 'Esmalte sintético de secado rápido y alto brillo. Protege y decora superficies de madera y metal, tanto en interiores como exteriores.', stock: 8 },
    { id: 3, name: 'Impermeabilizante Frentes 20L', brand: 'ProtecExterior', category: 'exterior', price: 58000, rating: 4.9, description: 'Recubrimiento acrílico elástico para frentes y muros exteriores. Máxima protección contra la humedad, rayos UV y formación de hongos.', stock: 20 },
    { id: 4, name: 'Rodillo Antigota 22cm Premium', brand: 'PintaFacil', category: 'accesorios', price: 8500, rating: 4.2, description: 'Rodillo de lana sintética antigota. Evita salpicaduras y logra un acabado parejo y profesional. Mango ergonómico.', stock: 50 },
    // fallback for other ids
];

export default function ProductDetail({ params }) {
    const { id } = use(params);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('descripcion');
    const { addToCart } = useCart();

    const product = mockProducts.find(p => p.id === parseInt(id)) || mockProducts[0]; // fallback

    const increaseQuantity = () => {
        if (quantity < product.stock) setQuantity(q => q + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(q => q - 1);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`¡Agregaste ${quantity}x ${product.name} al carrito!`);
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs & Back */}
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/catalogo" className="inline-flex items-center text-foreground/60 hover:text-primary transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Catálogo
                    </Link>
                    <div className="flex gap-4">
                        <button className="text-foreground/60 hover:text-red-500 transition-colors">
                            <Heart className="w-5 h-5" />
                        </button>
                        <button className="text-foreground/60 hover:text-primary transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="bg-card rounded-3xl border border-border overflow-hidden lg:grid lg:grid-cols-2 shadow-sm">
                    {/* Image Section */}
                    <div className="bg-gradient-to-tr from-muted to-secondary/50 p-12 flex items-center justify-center relative min-h-[400px]">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <PaintBucket className="w-48 h-48 text-primary/30 drop-shadow-xl" />
                        </motion.div>

                        <div className="absolute top-4 left-4">
                            <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm">Nuevo</span>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-8 lg:p-12 flex flex-col">
                        <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">{product.brand}</p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4 leading-tight">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center text-amber-400">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" opacity={0.5} />
                                <span className="ml-2 text-foreground/70 text-sm font-medium">{product.rating} (24)</span>
                            </div>
                            <span className="text-foreground/30">|</span>
                            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                Stock Disponible
                            </span>
                        </div>

                        <div className="mb-8">
                            <span className="text-4xl font-black text-foreground">${product.price.toLocaleString('es-AR')}</span>
                            <p className="text-sm text-foreground/60 mt-1">Precio final con IVA incluido</p>
                        </div>

                        <p className="text-foreground/80 mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="mt-auto space-y-6">
                            {/* Add to Cart Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center justify-between border-2 border-border rounded-2xl p-1 bg-background w-full sm:w-1/3">
                                    <button onClick={decreaseQuantity} className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted rounded-xl transition-colors font-bold text-xl">-</button>
                                    <span className="font-bold text-lg select-none w-8 text-center">{quantity}</span>
                                    <button onClick={increaseQuantity} className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted rounded-xl transition-colors font-bold text-xl">+</button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 font-bold text-lg rounded-2xl py-4 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Agregar al Carrito
                                </button>
                            </div>

                            {/* Perks */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-6">
                                <div className="flex items-center gap-3">
                                    <Truck className="w-8 h-8 text-primary/60" />
                                    <span className="text-xs font-medium text-foreground/80 leading-tight">Envío Gratis a partir de $50.000</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-8 h-8 text-primary/60" />
                                    <span className="text-xs font-medium text-foreground/80 leading-tight">Garantía  ColorShop 30 días</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RotateCcw className="w-8 h-8 text-primary/60" />
                                    <span className="text-xs font-medium text-foreground/80 leading-tight">Devolución fácil y rápida</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
