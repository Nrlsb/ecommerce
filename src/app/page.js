'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Paintbrush, PaintRoller, Droplet, Palette, ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';

const categories = [
  { name: 'Pintura Interior', icon: PaintRoller, color: 'bg-blue-100 text-blue-600', link: '/catalogo?tipo=interior' },
  { name: 'Pintura Exterior', icon: Paintbrush, color: 'bg-green-100 text-green-600', link: '/catalogo?tipo=exterior' },
  { name: 'Esmaltes y Barnices', icon: Droplet, color: 'bg-amber-100 text-amber-600', link: '/catalogo?tipo=esmaltes' },
  { name: 'Accesorios', icon: Palette, color: 'bg-purple-100 text-purple-600', link: '/catalogo?tipo=accesorios' },
];

const features = [
  { title: 'Envíos Rápidos', description: 'Entrega en 24hs en CABA y GBA', icon: Truck },
  { title: 'Calidad Premium', description: 'Las mejores marcas del mercado', icon: ShieldCheck },
  { title: 'Soporte 24/7', description: 'Te asesoramos en tus proyectos', icon: Clock },
];

const featuredProducts = [
  { id: 1, name: 'Látex Interior Premium', brand: 'ColorMaster', price: 45000, img: 'bg-gradient-to-tr from-slate-200 to-slate-300' },
  { id: 2, name: 'Esmalte Sintético Brillante', brand: 'BrilloMax', price: 22000, img: 'bg-gradient-to-tr from-red-200 to-red-300' },
  { id: 3, name: 'Impermeabilizante Frentes', brand: 'ProtecExterior', price: 58000, img: 'bg-gradient-to-tr from-green-200 to-green-300' },
  { id: 4, name: 'Rodillo Antigota 22cm', brand: 'PintaFacil', price: 8500, img: 'bg-gradient-to-tr from-orange-200 to-orange-300' },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-blue-900 text-primary-foreground overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent opacity-20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Dale vida a tus espacios con <span className="text-accent">el color perfecto</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl">
              Encuentra la mayor variedad de pinturas, herramientas y accesorios para transformar tu hogar o empresa. Calidad garantizada en cada gota.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalogo" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-transform hover:scale-105 shadow-lg">
                Ver Catálogo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/ofertas" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/20">
                Ver Ofertas
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="flex items-center justify-center md:justify-start gap-4"
              >
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{feature.title}</h4>
                  <p className="text-sm text-foreground/60">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">¿Qué estás buscando?</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">Explora nuestras categorías principales y encuentra exactamente lo que necesitas para tu próximo proyecto.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <motion.Link
                href={category.link}
                key={idx}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border transition-all group"
              >
                <div className={`p-5 rounded-2xl mb-4 ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-10 h-10" />
                </div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{category.name}</h3>
              </motion.Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Productos Destacados</h2>
              <p className="text-foreground/60">Los favoritos de nuestros clientes</p>
            </div>
            <Link href="/catalogo" className="hidden sm:flex items-center font-medium text-primary hover:text-primary/80 transition-colors">
              Ver todos <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card rounded-2xl overflow-hidden border border-border group hover:border-primary/50 transition-colors"
              >
                {/* Product Image Placeholder */}
                <div className={`aspect-square ${product.img} relative flex items-center justify-center p-6`}>
                  <PaintBucket className="w-20 h-20 text-white/50 drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md text-foreground shadow-sm">
                    Top Venta
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs text-foreground/50 font-medium mb-1 uppercase tracking-wider">{product.brand}</p>
                  <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-black text-xl text-primary">${product.price.toLocaleString('es-AR')}</span>
                    <button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground p-2 rounded-xl transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
