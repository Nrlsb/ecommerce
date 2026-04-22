import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, PaintBucket } from 'lucide-react';

interface Product {
  id: string;
  nombre: string;
  precio: number;
  marca?: string;
  imagen_url?: string;
}

interface ProductCardProps {
  product: Product;
  delay: number;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, delay, onAddToCart }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:border-primary/30 transition-all flex flex-col group"
    >
      <Link href={`/catalogo/${product.id}`} className="block relative group-hover:scale-105 transition-transform duration-500">
        <div className="aspect-square bg-gradient-to-tr from-secondary to-muted relative flex items-center justify-center p-6 text-center">
          {product.imagen_url ? (
            <img src={product.imagen_url} alt={product.nombre} className="w-full h-full object-contain" />
          ) : (
            <PaintBucket className="w-16 h-16 text-foreground/20" />
          )}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-foreground/50 font-medium mb-1 uppercase tracking-wider">
          {product.marca || 'Pinturería Mercurio'}
        </p>
        <Link href={`/catalogo/${product.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-bold text-foreground text-base mb-2 line-clamp-2 leading-tight">
            {product.nombre}
          </h3>
        </Link>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="font-black text-2xl text-primary">
            ${Number(product.precio).toLocaleString('es-AR')}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground p-3 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
