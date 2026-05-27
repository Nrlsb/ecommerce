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
  precio_con_descuento?: number;
  descuento_porcentual?: number;
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
      className="bg-card rounded-[2rem] overflow-hidden border border-border hover:shadow-[0_20px_50px_rgba(30,55,115,0.15)] hover:border-primary/45 hover:-translate-y-1.5 transition-all duration-300 flex flex-col group p-2 relative"
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
            <img src={product.imagen_url} alt={product.nombre} className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <img 
                src="/images/logos/logomercurio.png" 
                alt="Sin imagen" 
                className="w-40 h-auto opacity-40 transition-all duration-500 group-hover:scale-105 group-hover:opacity-60" 
              />
              <span className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/20">Imagen no disponible</span>
            </div>
          )}

          {/* Premium tag badge */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-mercurio-green animate-pulse"></span>
            <span className="text-[9px] font-display font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Garantía Mercurio</span>
          </div>

          {/* Badge de Oferta con Rosa Mercurio */}
          {product.descuento_porcentual && Number(product.descuento_porcentual) > 0 && (
            <div className="absolute top-12 left-4 z-20 px-3 py-1 bg-mercurio-pink border border-mercurio-pink/30 rounded-full flex items-center gap-1 shadow-lg shadow-mercurio-pink/20">
              <span className="text-[9px] font-display font-black uppercase tracking-wider text-white">
                {Math.round(Number(product.descuento_porcentual))}% OFF
              </span>
            </div>
          )}

          {/* Shimmer light effect inside the card */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out pointer-events-none z-10" />
        </div>
        
        {/* Wishlist Button con Rosa Mercurio */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all z-20 ${
            isWishlisted 
              ? 'bg-mercurio-pink border-mercurio-pink text-white shadow-lg shadow-mercurio-pink/20 hover:scale-110' 
              : 'bg-white/50 border-white/20 text-foreground/40 hover:text-mercurio-pink hover:border-mercurio-pink/30 hover:bg-white hover:scale-110'
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
          <div className="flex flex-col">
            {product.precio_con_descuento && Number(product.precio_con_descuento) < Number(product.precio) ? (
              <>
                <span className="text-xs text-foreground/40 line-through font-semibold">
                  ${Number(product.precio).toLocaleString('es-AR')}
                </span>
                <span className="font-black text-2xl text-primary">
                  ${Number(product.precio_con_descuento).toLocaleString('es-AR')}
                </span>
              </>
            ) : (
              <span className="font-black text-2xl text-primary">
                ${Number(product.precio).toLocaleString('es-AR')}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground p-3 rounded-xl transition-all duration-300 shadow-sm cursor-pointer flex items-center gap-2 group/btn hover:px-4"
          >
            <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            <span className="max-w-0 overflow-hidden group-hover/btn:max-w-xs transition-all duration-500 ease-in-out text-xs font-bold whitespace-nowrap">
              Agregar
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
