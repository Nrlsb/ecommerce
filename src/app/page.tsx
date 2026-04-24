'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Paintbrush, PaintRoller, Droplet, Palette, ArrowRight, ShieldCheck, Truck, Clock, PaintBucket, ShoppingCart } from 'lucide-react';
import { ProductCard } from '@/components/catalogo/ProductCard';

const categories = [
  { name: 'Pintura Interior', icon: PaintRoller, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', link: '/catalogo?tipo=interior', img: '/images/interior_paint.jpg' },
  { name: 'Pintura Exterior', icon: Paintbrush, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400', link: '/catalogo?tipo=exterior', img: '/images/exterior_paint.jpg' },
  { name: 'Esmaltes y Barnices', icon: Droplet, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', link: '/catalogo?tipo=esmaltes', img: '/images/enamel_paint.jpg' },
  { name: 'Accesorios', icon: Palette, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', link: '/catalogo?tipo=accesorios', img: '/images/roller_tool.jpg' },
];

const features = [
  { title: 'Envíos Rápidos', description: 'Entrega en 24hs en CABA y GBA', icon: Truck },
  { title: 'Calidad Premium', description: 'Las mejores marcas del mercado', icon: ShieldCheck },
  { title: 'Soporte 24/7', description: 'Te asesoramos en tus proyectos', icon: Clock },
];

const featuredProducts = [
  { id: '1', nombre: 'Látex Interior Premium', marca: 'ColorMaster', precio: 45000, imagen_url: '/images/interior_paint.jpg' },
  { id: '2', nombre: 'Esmalte Sintético Brillante', marca: 'BrilloMax', precio: 22000, imagen_url: '/images/enamel_paint.jpg' },
  { id: '3', nombre: 'Impermeabilizante Frentes', marca: 'ProtecExterior', precio: 58000, imagen_url: '/images/exterior_paint.jpg' },
  { id: '4', nombre: 'Rodillo Antigota 22cm', marca: 'PintaFacil', precio: 8500, imagen_url: '/images/roller_tool.jpg' },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
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

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-[#0D1B3A] text-primary-foreground overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-mercurio-pink opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-mercurio-yellow opacity-10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Dale vida a tus espacios con el <span className="text-mercurio-yellow underline decoration-mercurio-pink/50">toque Mercurio</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl">
              Transforma tu realidad con nuestra selección premium de pinturas y acabados. Calidad profesional al alcance de tu mano.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/catalogo" className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(235,40,145,0.3)]">
                Comprar Ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/ofertas" className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all border border-white/20">
                Ver Ofertas
              </Link>
            </div>
          </motion.div>
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
                  <Link href={category.link} className="block group relative overflow-hidden rounded-3xl h-80">
                    <img 
                      src={category.img} 
                      alt={category.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all"></div>
                    <div className="absolute bottom-0 left-0 p-8">
                      <div className={`inline-flex p-3 rounded-2xl mb-4 ${category.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-2xl text-white group-hover:translate-x-2 transition-transform">{category.name}</h3>
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
              <p className="text-foreground/60 text-lg">Calidad técnica garantizada en cada aplicación</p>
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
            {featuredProducts.map((product, idx) => (
               <ProductCard 
                 key={product.id}
                 product={product}
                 delay={idx * 0.1}
                 onAddToCart={() => {}} // Placeholder para home
               />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
