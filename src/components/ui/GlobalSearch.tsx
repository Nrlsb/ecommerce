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
    const inputRef = useRef<HTMLInputElement>(null);

    // Cerrar al hacer clic fuera o presionar Escape
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Enfocar el input cuando se abre el buscador
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Lógica de búsqueda
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
                .not('imagen_url', 'is', null)
                .neq('imagen_url', '')
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
        <div ref={searchRef} className="relative z-50 flex items-center">
            {/* Contenedor expandible con Framer Motion */}
            <motion.form
                onSubmit={handleSearch}
                initial={false}
                animate={{
                    width: isOpen ? 280 : 40,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                className={`h-10 flex items-center rounded-xl overflow-hidden border transition-all duration-300 ${
                    isOpen 
                        ? 'border-primary/30 bg-card shadow-md shadow-primary/5' 
                        : 'border-transparent hover:bg-primary/5'
                }`}
            >
                {/* Botón de buscar (icono) */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-10 w-10 flex items-center justify-center text-foreground/40 hover:text-primary transition-colors focus:outline-none flex-shrink-0 cursor-pointer"
                    aria-label="Buscar"
                >
                    <Search size={20} />
                </button>

                {/* Campo de entrada de texto */}
                <div className="flex-1 h-full relative flex items-center pr-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar productos, marcas..."
                        disabled={!isOpen}
                        className="w-full bg-transparent border-none outline-none text-xs font-semibold text-foreground placeholder:text-foreground/30 h-full pl-1 focus:ring-0 focus:outline-none"
                    />

                    {/* Botón de borrar (X) */}
                    <AnimatePresence>
                        {query && isOpen && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                type="button"
                                onClick={() => setQuery('')}
                                className="absolute right-2 text-foreground/40 hover:text-foreground p-1 cursor-pointer flex items-center justify-center"
                            >
                                <X size={14} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </motion.form>

            {/* Dropdown de sugerencias y resultados */}
            <AnimatePresence>
                {isOpen && (query.trim().length > 0 || results.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-[350px] md:w-[450px] bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
                    >
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
                                                    <img src={product.imagen_url} alt={product.nombre} className="w-full h-full object-contain p-1" />
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
