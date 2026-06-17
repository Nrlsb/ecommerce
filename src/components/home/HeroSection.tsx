'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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

export function HeroSection() {
  return (
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
  );
}
