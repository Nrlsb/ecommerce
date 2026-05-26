'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Paintbrush, PaintRoller, Droplet, Palette, ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import { ProductCard } from '@/components/catalogo/ProductCard';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

const categories = [
  { name: 'Pintura', icon: PaintRoller, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', link: '/catalogo?categoria=pintura', img: '/images/interior_paint.jpg' },
  { name: 'Automotor', icon: Paintbrush, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', link: '/catalogo?categoria=automotor', img: '/images/exterior_paint.jpg' },
  { name: 'Accesorios', icon: Palette, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', link: '/catalogo?categoria=accesorios', img: '/images/roller_tool.jpg' },
  { name: 'Prep. de Superficies', icon: Droplet, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', link: '/catalogo?categoria=prep-superficies', img: '/images/enamel_paint.jpg' },
];

const features = [
  { title: 'Envíos Rápidos', description: 'Entrega en 24hs en CABA y GBA', icon: Truck },
  { title: 'Calidad Premium', description: 'Las mejores marcas del mercado', icon: ShieldCheck },
  { title: 'Soporte 24/7', description: 'Te asesoramos en tus proyectos', icon: Clock },
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const heroTitleVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    }
  }
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        let { data, error } = await supabase
          .from('productos')
          .select('*')
          .eq('destacado', true)
          .not('imagen_url', 'is', null)
          .neq('imagen_url', '')
          .limit(4);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setFeaturedProducts(data);
        } else {
          const { data: latestData, error: latestError } = await supabase
            .from('productos')
            .select('*')
            .not('imagen_url', 'is', null)
            .neq('imagen_url', '')
            .order('id', { ascending: false })
            .limit(4);
          
          if (latestError) throw latestError;
          if (latestData) setFeaturedProducts(latestData);
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart({
      ...product,
      name: product.nombre,
      price: product.precio,
      brand: product.marca,
      quantity: 1,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-[#0D1B3A] text-primary-foreground overflow-hidden">
        {/* Background Decorative Blurs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-mercurio-pink opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-mercurio-yellow opacity-10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        {/* Animated Background Paint Drops */}
        <motion.div 
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-1/4 w-32 h-32 rounded-full bg-mercurio-blue/15 blur-2xl pointer-events-none"
        />
        <motion.div 
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-1/4 w-40 h-40 rounded-full bg-mercurio-pink/10 blur-3xl pointer-events-none"
        />
        <motion.div 
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-mercurio-green/10 blur-2xl pointer-events-none"
        />
        <motion.div 
          animate={{
            y: [0, 15, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-1/3 left-10 w-28 h-28 rounded-full bg-mercurio-yellow/15 blur-2xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <motion.h1 
              variants={heroTitleVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight font-display"
            >
              <motion.span variants={wordVariants} className="inline-block mr-3">Dale</motion.span>
              <motion.span variants={wordVariants} className="inline-block mr-3">vida</motion.span>
              <motion.span variants={wordVariants} className="inline-block mr-3">a</motion.span>
              <motion.span variants={wordVariants} className="inline-block mr-3">tus</motion.span>
              <motion.span variants={wordVariants} className="inline-block mr-3">espacios</motion.span>
              <motion.span variants={wordVariants} className="inline-block mr-3">con</motion.span>
              <motion.span variants={wordVariants} className="inline-block mr-3">el</motion.span>
              <motion.span 
                variants={wordVariants} 
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-mercurio-yellow via-mercurio-pink to-mercurio-green font-black"
              >
                toque Mercurio
              </motion.span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl font-light"
            >
              Transforma tu realidad con nuestra selección premium de pinturas y acabados. Calidad profesional al alcance de tu mano.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 100 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link href="/catalogo" className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:scale-105 shadow-[0_0_30px_rgba(235,40,145,0.45)] hover:shadow-[0_0_40px_rgba(235,40,145,0.6)] cursor-pointer">
                Comprar Ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/ofertas" className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all border border-white/20 cursor-pointer">
                Ver Ofertas
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                  className="flex flex-col md:flex-row items-center gap-4 group"
                >
                  <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm tracking-wide uppercase">{feature.title}</h4>
                    <p className="text-xs text-foreground/60">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-foreground mb-4 tracking-tight">Explora por Categoría</h2>
            <div className="w-20 h-1.5 bg-mercurio-pink mx-auto rounded-full"></div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {categories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <motion.div variants={itemVariants} key={idx}>
                  <Link href={category.link} className="block group relative overflow-hidden rounded-[2rem] h-80 shadow-md hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-primary/20">
                    <img 
                      src={category.img} 
                      alt={category.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Dynamic color overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:via-primary/20 transition-all duration-500"></div>
                    <div className="absolute bottom-0 left-0 p-8 z-10 w-full">
                      <div className={`inline-flex p-3.5 rounded-2xl mb-4 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 ${category.color} shadow-lg`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-black text-2xl text-white tracking-tight flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-500">
                        {category.name}
                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-mercurio-yellow" />
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-foreground mb-2 tracking-tight">Lo Más Destacado</h2>
              <p className="text-foreground/60 text-lg font-light">Calidad técnica garantizada en cada aplicación</p>
            </div>
            <Link href="/catalogo" className="hidden sm:flex items-center font-bold text-primary group">
              VER TODO <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {isLoading ? (
              // Loading Skeletons
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-[2rem] h-[400px] animate-pulse border border-border"></div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, idx) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  delay={idx * 0.1}
                  onAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-foreground/40">
                No se encontraron productos destacados.
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
