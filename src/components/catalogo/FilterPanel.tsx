import { motion } from 'framer-motion';
import { Filter, Check, ChevronDown, RotateCcw } from 'lucide-react';
import { RangeSlider } from '../ui/RangeSlider';

interface Category {
  id: string;
  name: string;
}

interface FilterPanelProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  selectedBrands: string[];
  onBrandChange: (brand: string) => void;
  brands: string[];
  activeSort: string;
  onSortChange: (sort: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClearAll: () => void;
}

export function FilterPanel({
  categories,
  activeCategory,
  onCategoryChange,
  selectedBrands,
  onBrandChange,
  brands,
  activeSort,
  onSortChange,
  priceRange,
  onPriceChange,
  isOpen,
  onToggle,
  onClearAll,
}: FilterPanelProps) {
  const hasFilters = activeCategory !== 'todos' || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000000;

  return (
    <>
      <div className="lg:hidden mb-4">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between bg-card p-5 rounded-2xl border border-border font-bold shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Filter size={20} />
            </div>
            Filtros y Categorías
          </div>
          <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <motion.aside
        className={`${isOpen ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="bg-card border border-border rounded-[2rem] p-8 sticky top-24 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-xl flex items-center gap-2">
              <Filter size={20} className="text-primary" /> Filtros
            </h3>
            {hasFilters && (
              <button
                onClick={onClearAll}
                className="text-xs font-bold text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors flex items-center gap-1"
                title="Limpiar todos los filtros"
              >
                <RotateCcw size={14} />
                Reiniciar
              </button>
            )}
          </div>

          {/* Categorías */}
          <section>
            <h4 className="font-bold text-sm text-foreground/50 uppercase tracking-widest mb-4">Categorías</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onCategoryChange(cat.id)}
                    className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm ${
                      activeCategory === cat.id
                        ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 scale-[1.02]'
                        : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    {cat.name}
                    {activeCategory === cat.id && <Check size={16} strokeWidth={3} />}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Rango de Precio */}
          <section>
            <h4 className="font-bold text-sm text-foreground/50 uppercase tracking-widest mb-4">Precio</h4>
            <RangeSlider
              min={0}
              max={1000000}
              step={1000}
              value={priceRange}
              onChange={onPriceChange}
            />
          </section>

          {/* Marcas */}
          <section>
            <h4 className="font-bold text-sm text-foreground/50 uppercase tracking-widest mb-4">Marcas</h4>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer transition-colors group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => onBrandChange(brand)}
                      className="peer appearance-none w-5 h-5 rounded-md border-2 border-border checked:bg-primary checked:border-primary transition-all cursor-pointer"
                    />
                    <Check size={14} className="absolute text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={4} />
                  </div>
                  <span className="text-sm text-foreground/70 group-hover:text-foreground font-medium transition-colors">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Ordenar */}
          <section>
            <h4 className="font-bold text-sm text-foreground/50 uppercase tracking-widest mb-4">Ordenar por</h4>
            <div className="relative">
              <select
                value={activeSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full bg-secondary border border-border text-foreground text-sm font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="destacados">Destacados</option>
                <option value="menor_precio">Menor Precio</option>
                <option value="mayor_precio">Mayor Precio</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" size={16} />
            </div>
          </section>
        </div>
      </motion.aside>
    </>
  );
}
