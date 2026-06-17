'use client';

import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Clock } from 'lucide-react';

const features = [
  { title: 'Envíos Rápidos', description: 'Entrega en 24hs en CABA y GBA', icon: Truck },
  { title: 'Calidad Premium', description: 'Las mejores marcas del mercado', icon: ShieldCheck },
  { title: 'Soporte 24/7', description: 'Te asesoramos en tus proyectos', icon: Clock },
];

export function FeaturesBar() {
  return (
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
  );
}
