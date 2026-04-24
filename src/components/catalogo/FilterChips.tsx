'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterChipsProps {
  activeCategory: string;
  categories: { id: string; name: string }[];
  selectedBrands: string[];
  priceRange: [number, number];
  onRemoveCategory: () => void;
  onRemoveBrand: (brand: string) => void;
  onResetPrice: () => void;
  onClearAll: () => void;
}

export function FilterChips({
  activeCategory,
  categories,
  selectedBrands,
  priceRange,
  onRemoveCategory,
  onRemoveBrand,
  onResetPrice,
  onClearAll,
}: FilterChipsProps) {
  const categoryName = categories.find((c) => c.id === activeCategory)?.name;
  const hasActiveFilters = activeCategory !== 'todos' || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000000;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm font-medium text-foreground/50 mr-2">Filtros activos:</span>
      
      <AnimatePresence>
        {activeCategory !== 'todos' && categoryName && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onRemoveCategory}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold hover:bg-primary/20 transition-colors group"
          >
            {categoryName}
            <X size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        )}

        {selectedBrands.map((brand) => (
          <motion.button
            key={brand}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onRemoveBrand(brand)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground border border-border rounded-full text-xs font-bold hover:bg-border transition-colors group"
          >
            {brand}
            <X size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}

        {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onResetPrice}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground border border-border rounded-full text-xs font-bold hover:bg-border transition-colors group"
          >
            ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
            <X size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        )}

        <button
          onClick={onClearAll}
          className="text-xs font-bold text-primary hover:underline px-2 py-1 transition-all"
        >
          Limpiar todo
        </button>
      </AnimatePresence>
    </div>
  );
}
