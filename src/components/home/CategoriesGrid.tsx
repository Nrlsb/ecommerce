'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Paintbrush, PaintRoller, Droplet, Palette, ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Pintura', icon: PaintRoller, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', link: '/catalogo?categoria=pintura', img: '/images/interior_paint.jpg' },
  { name: 'Automotor', icon: Paintbrush, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', link: '/catalogo?categoria=automotor', img: '/images/exterior_paint.jpg' },
  { name: 'Accesorios', icon: Palette, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', link: '/catalogo?categoria=accesorios', img: '/images/roller_tool.jpg' },
  { name: 'Prep. de Superficies', icon: Droplet, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', link: '/catalogo?categoria=prep-superficies', img: '/images/enamel_paint.jpg' },
];

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

export function CategoriesGrid() {
  return (
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
  );
}
