'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Filter, ShoppingCart, PaintBucket, ChevronDown, Check, Search, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

export default function Catalogo() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([{ id: 'todos', name: 'Todos los productos' }]);
    const [activeCategory, setActiveCategory] = useState('todos');
    const [activeSort, setActiveSort] = useState('destacados');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const PAGE_SIZE = 20;
    const { addToCart } = useCart();

    // Fetch Categories once
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data: catData } = await supabase.from('categorias').select('*');
                if (catData) {
                    setCategories([
                        { id: 'todos', name: 'Todos los productos' },
                        ...catData.map(c => ({ id: c.slug, name: c.nombre }))
                    ]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Products with filters and pagination
    const fetchProducts = async (currentPage, isNewSearch = false) => {
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

            // Apply filters
            if (activeCategory !== 'todos') {
                query = query.eq('categorias.slug', activeCategory);
            }

            if (searchQuery) {
                query = query.ilike('nombre', `%${searchQuery}%`);
            }

            if (selectedBrands.length > 0) {
                query = query.in('marca', selectedBrands);
            }

            // Apply sorting
            if (activeSort === 'menor_precio') {
                query = query.order('precio', { ascending: true });
            } else if (activeSort === 'mayor_precio') {
                query = query.order('precio', { ascending: false });
            } else {
                query = query.order('id', { ascending: false }); // destacados/default
            }

            // Apply pagination
            query = query.range(start, end);

            // Evitar cache del navegador añadiendo un timestamp a los headers de la petición (Vía Supabase)
            // O simplemente añadir un filtro que no afecte el resultado pero cambie la URL
            query = query.or(`id.gt.0,id.eq.0`); // Filtro inocuo para cambiar la firma de la petición postgrest si fuera necesario
            
            const { data, count, error } = await query;

            if (error) throw error;

            if (data) {
                const formattedProducts = data.map(p => ({
                    ...p,
                    category: p.categorias?.slug || 'interior',
                    rating: 4.5
                }));

                if (isNewSearch) {
                    setProducts(formattedProducts);
                } else {
                    setProducts(prev => [...prev, ...formattedProducts]);
                }

                setHasMore(count > start + formattedProducts.length);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('No pudimos cargar los productos en este momento. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
            setIsInitialLoading(false);
        }
    };

    // Reset and fetch when filters change
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

    const brands = [
        'Pinturería Mercurio',
        'Alba',
        'Sherwin Williams',
        'Colorín',
        'Tersuave',
        'Plavicon',
        'Casablanca'
    ]; // Hardcoded or fetch from DB if needed. For now let's keep it simple or try to get from all products if they were all loaded.
    // Since we don't have all products, we might need a separate query for brands or just use a predefined list.
    // The previous code did: const brands = [...new Set(products.map(p => p.marca || 'Genérico'))];
    // But now products are paginated. I'll use a fixed list for now or just stick to the ones found in current loaded products for simplicity in this step.
    const currentLoadedBrands = [...new Set(products.map(p => p.marca || 'Pinturería Mercurio'))];

    const toggleBrand = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const handleAddToCart = (product) => {
        addToCart({
            ...product,
            name: product.nombre,
            price: product.precio,
            brand: product.marca
        }, 1);
    };

    return (
        <div className="min-h-screen bg-muted/20 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb & Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Catálogo de Productos</h1>
                    <p className="text-foreground/60 mt-2">Encuentra todo lo que necesitas para tu proyecto</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                            className="w-full flex items-center justify-between bg-card p-4 rounded-xl border border-border font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Filter size={20} />
                                Filtros y Categorías
                            </div>
                            <ChevronDown size={20} className={`transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Sidebar / Filters */}
                    <motion.aside
                        className={`${isMobileFiltersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}
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
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm ${activeCategory === cat.id
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
                                {currentLoadedBrands.map((brand) => (
                                    <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(brand)}
                                            onChange={() => toggleBrand(brand)}
                                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">{brand}</span>
                                    </label>
                                ))}
                            </div>

                            <h3 className="font-bold text-lg mt-8 mb-4">Ordenar por</h3>
                            <select
                                value={activeSort}
                                onChange={(e) => setActiveSort(e.target.value)}
                                className="w-full bg-secondary border border-border text-foreground text-sm rounded-lg p-2.5 focus:ring-primary focus:border-primary outline-none transition-shadow"
                            >
                                <option value="destacados">Destacados</option>
                                <option value="menor_precio">Menor Precio</option>
                                <option value="mayor_precio">Mayor Precio</option>
                            </select>
                        </div>
                    </motion.aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Search Bar */}
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Busca por producto o marca..."
                                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                            />
                        </div>

                        <div className="mb-6 flex justify-between items-center bg-card p-4 rounded-xl border border-border">
                            <span className="text-foreground/70 font-medium font-sm">
                                {error ? (
                                    <span className="text-destructive font-medium font-sm flex items-center gap-2">
                                        <Filter className="w-4 h-4" /> {error}
                                    </span>
                                ) : isInitialLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" /> Cargando productos...
                                    </span>
                                ) : (
                                    <>Encontrados <strong className="text-foreground">{products.length}</strong> productos</>
                                )}
                            </span>
                        </div>

                        {isInitialLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-card rounded-2xl h-80 animate-pulse border border-border" />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product, idx) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: (idx % PAGE_SIZE) * 0.05 }}
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
                                                <p className="text-xs text-foreground/50 font-medium mb-1 uppercase tracking-wider">{product.marca || 'Pinturería Mercurio'}</p>
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
                                                        onClick={() => handleAddToCart(product)}
                                                        className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground p-3 rounded-xl transition-colors shadow-sm cursor-pointer"
                                                    >
                                                        <ShoppingCart className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {products.length === 0 && (
                                        <div className="col-span-full py-12 text-center text-foreground/60">
                                            <PaintBucket className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                            <p className="text-lg">No se encontraron productos con estos filtros.</p>
                                        </div>
                                    )}
                                </div>

                                {hasMore && (
                                    <div className="mt-12 flex justify-center">
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={isLoading}
                                            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Cargando...
                                                </>
                                            ) : (
                                                'Cargar más productos'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
