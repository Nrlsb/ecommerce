'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { FilterPanel } from '@/components/catalogo/FilterPanel';
import { SearchBar } from '@/components/catalogo/SearchBar';
import { ProductGrid } from '@/components/catalogo/ProductGrid';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  nombre: string;
  precio: number;
  marca?: string;
  imagen_url?: string;
  categoria_id?: string;
  categorias?: { slug: string };
}

const PAGE_SIZE = 20;

export default function Catalogo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([{ id: 'todos', name: 'Todos los productos' }]);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [activeSort, setActiveSort] = useState('destacados');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: catData } = await supabase.from('categorias').select('*');
        if (catData) {
          setCategories([
            { id: 'todos', name: 'Todos los productos' },
            ...catData.map((c: any) => ({ id: c.slug, name: c.nombre })),
          ]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error instanceof Error ? error.message : String(error));
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async (currentPage: number, isNewSearch: boolean = false) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    if (isNewSearch) setIsInitialLoading(true);

    try {
      const start = currentPage * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      const selectString = activeCategory === 'todos'
        ? '*, categorias:categoria_id(slug)'
        : '*, categorias:categoria_id!inner(slug)';

      let query = supabase
        .from('productos')
        .select(selectString, { count: 'exact' });

      if (activeCategory !== 'todos') {
        query = query.eq('categorias.slug', activeCategory);
      }

      if (searchQuery) {
        query = query.ilike('nombre', `%${searchQuery}%`);
      }

      if (selectedBrands.length > 0) {
        query = query.in('marca', selectedBrands);
      }

      if (activeSort === 'menor_precio') {
        query = query.order('precio', { ascending: true });
      } else if (activeSort === 'mayor_precio') {
        query = query.order('precio', { ascending: false });
      } else {
        query = query.order('id', { ascending: false });
      }

      query = query.range(start, end);

      const { data, count, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      if (data) {
        const formattedProducts = data.map((p: any) => ({
          ...p,
          category: p.categorias?.slug || 'interior',
        }));

        if (isNewSearch) {
          setProducts(formattedProducts);
        } else {
          setProducts((prev) => [...prev, ...formattedProducts]);
        }

        setHasMore((count || 0) > start + formattedProducts.length);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(`Error: ${errorMessage}`);
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchProducts(0, true);
  }, [activeCategory, activeSort, searchQuery, selectedBrands]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  const currentLoadedBrands = [...new Set(products.map((p) => p.marca || 'Pinturería Mercurio'))];

  const handleAddToCart = (product: Product) => {
    addToCart({
      ...product,
      name: product.nombre,
      price: product.precio,
      brand: product.marca,
      quantity: 1,
    });
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Catálogo de Productos</h1>
          <p className="text-foreground/60 mt-2">Encuentra todo lo que necesitas para tu proyecto</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterPanel
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            selectedBrands={selectedBrands}
            onBrandChange={toggleBrand}
            brands={currentLoadedBrands}
            activeSort={activeSort}
            onSortChange={setActiveSort}
            isOpen={isMobileFiltersOpen}
            onToggle={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          />

          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            <ProductGrid
              products={products}
              isLoading={isLoading}
              isInitialLoading={isInitialLoading}
              error={error}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              onAddToCart={handleAddToCart}
              pageSize={PAGE_SIZE}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
