'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { FilterPanel } from '@/components/catalogo/FilterPanel';
import { SearchBar } from '@/components/catalogo/SearchBar';
import { ProductGrid } from '@/components/catalogo/ProductGrid';
import { FilterChips } from '@/components/catalogo/FilterChips';

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
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando catálogo...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}

function CatalogoContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoria') || 'todos';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([{ id: 'todos', name: 'Todos los productos' }]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSort, setActiveSort] = useState('destacados');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
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
      
      console.log(`🔍 Buscando productos (Página ${currentPage})...`);
      
      const selectString = '*, categorias:categoria_id(slug), subcategorias:subcategoria_id(slug)';

      let query = supabase
        .from('productos')
        .select(selectString, { count: 'exact' });

      if (activeCategory !== 'todos') {
        // Buscamos coincidencia en la categoría principal O en la subcategoría usando los alias definidos en selectString
        query = query.or(`categorias.slug.eq.${activeCategory},subcategorias.slug.eq.${activeCategory}`);
      }

      if (searchQuery) {
        query = query.ilike('nombre', `%${searchQuery}%`);
        
        // Registrar la búsqueda en analíticas (sin esperar respuesta para no bloquear)
        if (searchQuery.length >= 3 && currentPage === 0) {
          fetch('/api/analytics/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: searchQuery })
          }).catch(err => console.error('Error reporting search analytics:', err));
        }
      }

      if (selectedBrands.length > 0) {
        query = query.in('marca', selectedBrands);
      }

      // Filtro de precio
      if (priceRange[0] > 0) {
        query = query.gte('precio', priceRange[0]);
      }
      if (priceRange[1] < 1000000) {
        query = query.lte('precio', priceRange[1]);
      }

      if (activeSort === 'menor_precio') {
        query = query.order('precio', { ascending: true });
      } else if (activeSort === 'mayor_precio') {
        query = query.order('precio', { ascending: false });
      } else {
        query = query.order('id', { ascending: false });
      }

      query = query.range(start, end);

      // Crear una promesa de timeout de 15 segundos
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Tiempo de espera agotado: La base de datos no responde.')), 15000)
      );

      // Competir entre la consulta real y el timeout
      const { data, count, error: supabaseError } = await Promise.race([
        query,
        timeoutPromise
      ]) as any;

      if (supabaseError) throw supabaseError;

      if (data) {
        console.log(`✅ Se cargaron ${data.length} productos.`);
        const formattedProducts = data.map((p: any) => ({
          ...p,
          category: p.subcategorias?.slug || p.categorias?.slug || 'interior',
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
  }, [activeCategory, activeSort, searchQuery, selectedBrands, priceRange]);

  // Sincronizar con cambios en la URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get('categoria');
    if (categoryFromUrl && categoryFromUrl !== activeCategory) {
      setActiveCategory(categoryFromUrl);
    }
  }, [searchParams]);

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

  const clearAllFilters = () => {
    setActiveCategory('todos');
    setSelectedBrands([]);
    setPriceRange([0, 1000000]);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-foreground tracking-tight">Catálogo de Productos</h1>
          <p className="text-foreground/60 mt-2 text-lg">Encuentra todo lo que necesitas para tu proyecto</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterPanel
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            selectedBrands={selectedBrands}
            onBrandChange={toggleBrand}
            brands={currentLoadedBrands}
            activeSort={activeSort}
            onSortChange={setActiveSort}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            isOpen={isMobileFiltersOpen}
            onToggle={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            onClearAll={clearAllFilters}
          />

          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            
            <FilterChips
              activeCategory={activeCategory}
              categories={categories}
              selectedBrands={selectedBrands}
              priceRange={priceRange}
              onRemoveCategory={() => setActiveCategory('todos')}
              onRemoveBrand={toggleBrand}
              onResetPrice={() => setPriceRange([0, 1000000])}
              onClearAll={clearAllFilters}
            />

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
