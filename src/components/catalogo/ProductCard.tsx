import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

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
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      className="bg-card rounded-[2rem] overflow-hidden border border-border hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-primary/30 transition-all flex flex-col group p-2"
    >
      <Link href={`/catalogo/${product.id}`} className="block relative h-64 overflow-hidden rounded-2xl group-hover:shadow-lg transition-all duration-500">
        <div className="w-full h-full bg-muted dark:bg-slate-900/50 relative flex items-center justify-center p-4">
          {/* Logo watermark */}
          <img 
            src="/images/logos/logomercurio.png" 
            alt="Mercurio Pinturerías" 
            className="absolute bottom-3 right-3 w-14 h-auto opacity-[0.12] pointer-events-none z-10" 
          />
          {product.imagen_url ? (
            <img src={product.imagen_url} alt={product.nombre} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-700" />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <img 
                src="/images/logos/logomercurio.png" 
                alt="Sin imagen" 
                className="w-40 h-auto opacity-40 transition-all duration-500 group-hover:scale-110 group-hover:opacity-60" 
              />
              <span className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/20">Imagen no disponible</span>
            </div>
          )}
        </div>
        
        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all z-20 ${
            isWishlisted 
              ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-200' 
              : 'bg-white/50 border-white/20 text-foreground/40 hover:text-red-500 hover:bg-white'
          }`}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2.5} />
        </button>
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
