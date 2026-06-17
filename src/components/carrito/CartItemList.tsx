'use client';

import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartItemList() {
  const { items, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div 
            key={item.id} 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="bg-card border border-border p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-sm"
          >
            <div className="w-full sm:w-24 h-24 bg-muted dark:bg-slate-900/50 rounded-xl flex items-center justify-center flex-shrink-0 p-2 relative overflow-hidden">
              {item.imagen_url ? (
                <img 
                  src={item.imagen_url || undefined} 
                  alt={item.name} 
                  className="w-full h-full object-contain rounded-lg" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <img 
                    src="/images/logos/logomercurio.png" 
                    alt="Sin imagen" 
                    className="w-12 h-auto opacity-20 mb-1" 
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/30">
                    {item.brand || 'Mercurio'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground line-clamp-2">{item.name}</h3>
              <p className="text-sm text-primary font-medium mt-1">
                ${item.price.toLocaleString('es-AR')} c/u
              </p>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 mt-4 sm:mt-0">
              <div className="flex items-center border border-border rounded-xl p-1 bg-background">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-muted text-foreground rounded-lg transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-muted text-foreground rounded-lg transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right min-w-[100px]">
                <p className="font-black text-xl text-foreground">
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-destructive/70 hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-lg"
                aria-label="Eliminar del carrito"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
