import { motion } from 'framer-motion';
import { Filter, Check, ChevronDown } from 'lucide-react';

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
  isOpen: boolean;
  onToggle: () => void;
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
  isOpen,
  onToggle,
}: FilterPanelProps) {
  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(brand);
    } else {
      onBrandChange(brand);
    }
  };

  return (
    <>
      <div className="lg:hidden mb-4">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between bg-card p-4 rounded-xl border border-border font-medium"
        >
          <div className="flex items-center gap-2">
            <Filter size={20} />
            Filtros y Categorías
          </div>
          <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <motion.aside
        className={`${isOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Filter size={18} className="text-primary" /> Categorías
          </h3>
          <ul className="space-y-3">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => onCategoryChange(cat.id)}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm ${
                    activeCategory === cat.id
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {cat.name}
                  {activeCategory === cat.id && <Check size={16} />}
                </button>
              </li>
            ))}
          </ul>

          <h3 className="font-bold text-lg mt-8 mb-4">Marcas</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>

          <h3 className="font-bold text-lg mt-8 mb-4">Ordenar por</h3>
          <select
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-secondary border border-border text-foreground text-sm rounded-lg p-2.5 focus:ring-primary focus:border-primary outline-none transition-shadow"
          >
            <option value="destacados">Destacados</option>
            <option value="menor_precio">Menor Precio</option>
            <option value="mayor_precio">Mayor Precio</option>
          </select>
        </div>
      </motion.aside>
    </>
  );
}
