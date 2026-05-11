'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from 'use-debounce';

interface Product {
    id: number;
    nombre: string;
    precio: number;
    marca: string;
    imagen_url: string;
    slug: string;
}

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebounce(query, 500);
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search logic
    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.trim().length < 2) {
                setResults([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            const { data, error } = await supabase
                .from('productos')
                .select('id, nombre, precio, marca, imagen_url, slug')
                .or(`nombre.ilike.%${debouncedQuery}%,marca.ilike.%${debouncedQuery}%,tags.ilike.%${debouncedQuery}%`)
                .limit(5);

            if (!error && data) {
                setResults(data);
            }
            setIsLoading(false);
        };

        fetchResults();
    }, [debouncedQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            router.push(`/catalogo?busqueda=${encodeURIComponent(query)}`);
            setQuery('');
        }
    };

    return (
        <div ref={searchRef} className="relative z-50">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-foreground/40 hover:text-primary transition-all hover:scale-110 p-2"
                aria-label="Buscar"
            >
                <Search size={20} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-[350px] md:w-[450px] bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
                    >
                        <form onSubmit={handleSearch} className="relative border-b border-border">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                            <input 
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar productos, marcas, categorías..."
                                autoFocus
                                className="w-full pl-12 pr-12 py-4 bg-transparent outline-none text-foreground font-medium"
                            />
                            {query && (
                                <button 
                                    type="button"
                                    onClick={() => setQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </form>

                        <div className="max-h-[60vh] overflow-y-auto">
                            {isLoading ? (
                                <div className="p-8 flex justify-center text-primary/40">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            ) : results.length > 0 ? (
                                <div className="p-2">
                                    <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest px-3 py-2">Sugerencias</h3>
                                    {results.map((product) => (
                                        <Link 
                                            key={product.id}
                                            href={`/catalogo/${product.slug || product.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded-xl transition-colors group"
                                        >
                                            <div className="w-12 h-12 bg-background border border-border rounded-lg overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                                                {product.imagen_url ? (
                                                    <img src={product.imagen_url} alt={product.nombre} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-[10px] font-bold text-foreground/20">{product.marca}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{product.nombre}</h4>
                                                <div className="flex items-center justify-between mt-0.5">
                                                    <span className="text-xs text-foreground/60">{product.marca}</span>
                                                    <span className="text-xs font-black text-primary">${product.precio?.toLocaleString('es-AR')}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    
                                    <button 
                                        onClick={handleSearch}
                                        className="w-full mt-2 p-3 flex items-center justify-center gap-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors"
                                    >
                                        Ver todos los resultados <ArrowRight size={16} />
                                    </button>
                                </div>
                            ) : query.length >= 2 ? (
                                <div className="p-8 text-center text-foreground/60">
                                    No encontramos resultados para "<span className="font-bold text-foreground">{query}</span>"
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Escribe al menos 2 letras</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
