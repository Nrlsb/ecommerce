'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/catalogo/ProductCard';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  nombre: string;
  precio: number;
  marca?: string;
  imagen_url?: string;
  precio_con_descuento?: number;
  descuento_porcentual?: number;
}

interface FeaturedProductsProps {
  initialProducts: Product[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export function FeaturedProducts({ initialProducts }: FeaturedProductsProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
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
          {initialProducts.length > 0 ? (
            initialProducts.map((product, idx) => (
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
  );
}
