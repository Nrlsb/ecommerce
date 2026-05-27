'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowLeft, Percent, ShoppingBag, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/catalogo/ProductCard';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

export default function OfertasPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchOfertas = async () => {
            try {
                setIsLoading(true);
                // Obtenemos los productos con descuento directo
                const { data, error } = await supabase
                    .from('productos')
                    .select('*')
                    .gt('descuento_porcentual', 0)
                    .order('descuento_porcentual', { ascending: false });

                if (error) throw error;

                if (data) {
                    setProducts(data);
                }
            } catch (err) {
                console.error('Error fetching offers:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOfertas();
    }, []);

    const handleAddToCart = (product: any) => {
        addToCart({
            ...product,
            name: product.nombre,
            price: product.precio_con_descuento || product.precio,
            brand: product.marca,
            quantity: 1,
        });
    };

    // Framer motion variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 25 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 80,
                damping: 15
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 font-sans antialiased pb-24">
            
            {/* Header / Hero Section con estética Premium Rosa/Magenta */}
            <div className="relative overflow-hidden py-20 bg-[#020617] border-b border-white/5">
                {/* Línea superior con gradiente de la marca */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-mercurio-blue via-mercurio-pink to-mercurio-yellow"></div>
                
                {/* Background Glows en Rosa/Magenta y Azul */}
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-tr from-mercurio-pink/15 to-mercurio-blue/5 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
                <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-gradient-to-tr from-mercurio-yellow/5 to-mercurio-pink/5 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white mb-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300">
                        <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
                    </Link>
                    
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black bg-mercurio-pink/10 border border-mercurio-pink/20 text-mercurio-pink uppercase tracking-widest">
                        <Percent className="w-3 h-3" /> Promociones Activas
                    </span>
                    
                    {/* Título en cursiva/italic evocando el dinamismo del logo */}
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase font-display">
                        <span className="italic block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">Ofertas</span>{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-mercurio-pink to-mercurio-yellow font-black">Mercurio</span>
                    </h1>
                    
                    <p className="text-slate-400 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
                        Aprovechá descuentos exclusivos en una amplia gama de pinturas, esmaltes y herramientas seleccionadas para tus proyectos.
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {isLoading ? (
                    // Loading State
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-card rounded-[2rem] h-[400px] animate-pulse border border-border"></div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {products.map((product, idx) => (
                            <motion.div variants={itemVariants} key={product.id}>
                                <ProductCard 
                                    product={product}
                                    delay={idx * 0.05}
                                    onAddToCart={handleAddToCart}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    // Empty State
                    <div className="text-center py-20 bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 shadow-premium max-w-2xl mx-auto px-6 space-y-6">
                        <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
                            <ShoppingBag className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Sin Ofertas Activas</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-light max-w-md mx-auto leading-relaxed">
                            Actualmente no disponemos de ofertas con descuento directo en el catálogo. Te sugerimos revisar las categorías del catálogo general.
                        </p>
                        <Link href="/catalogo" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20 cursor-pointer text-sm uppercase tracking-wider">
                            Explorar Catálogo
                        </Link>
                    </div>
                )}
            </div>

            {/* Banner de soporte / Financiamiento */}
            <div className="max-w-5xl mx-auto px-6 mt-20">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden bg-gradient-to-r from-mercurio-blue/10 via-mercurio-pink/5 to-mercurio-yellow/5 border border-slate-200/80 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center shadow-xl group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-mercurio-pink/5 to-mercurio-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                    
                    <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
                        <div className="inline-flex p-3 bg-mercurio-yellow/15 text-mercurio-yellow rounded-full">
                            <Sparkles className="w-6 h-6 animate-pulse" />
                        </div>
                        <span className="block text-[10px] font-black tracking-widest text-mercurio-pink uppercase">Financiación y Medios de Pago</span>
                        <h3 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            ¿Buscás más facilidades?
                        </h3>
                        <p className="text-sm md:text-base text-slate-650 dark:text-slate-300 font-light leading-relaxed">
                            Conocé nuestras promociones bancarias, planes de cuotas sin interés y los métodos de pago que tenemos para vos.
                        </p>
                        <div className="pt-4">
                            <Link href="/medios-de-pago" className="inline-flex items-center gap-2 text-xs font-black text-mercurio-blue dark:text-mercurio-yellow hover:underline uppercase tracking-widest">
                                Ver Medios de Pago y Financiación →
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
