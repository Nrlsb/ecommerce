'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Filter, ShoppingCart, PaintBucket, ChevronDown, Check } from 'lucide-react';

const mockProducts = [
    { id: 1, name: 'Látex Interior Premium 20L', brand: 'ColorMaster', category: 'interior', price: 45000, rating: 4.8 },
    { id: 2, name: 'Esmalte Sintético Brillante 4L', brand: 'BrilloMax', category: 'esmaltes', price: 22000, rating: 4.5 },
    { id: 3, name: 'Impermeabilizante Frentes 20L', brand: 'ProtecExterior', category: 'exterior', price: 58000, rating: 4.9 },
    { id: 4, name: 'Rodillo Antigota 22cm Premium', brand: 'PintaFacil', category: 'accesorios', price: 8500, rating: 4.2 },
    { id: 5, name: 'Enduído Plástico Interior 10L', brand: 'ColorMaster', category: 'interior', price: 15000, rating: 4.6 },
    { id: 6, name: 'Látex Exterior Frentes 10L', brand: 'ColorMaster', category: 'exterior', price: 32000, rating: 4.3 },
    { id: 7, name: 'Pincel Cerda Blanca Nº 15', brand: 'PintaFacil', category: 'accesorios', price: 3200, rating: 4.0 },
    { id: 8, name: 'Barniz Marino Doble Filtro 4L', brand: 'BrilloMax', category: 'esmaltes', price: 28000, rating: 4.7 },
];

const categories = [
    { id: 'todos', name: 'Todos los productos' },
    { id: 'interior', name: 'Pintura Interior' },
    { id: 'exterior', name: 'Pintura Exterior' },
    { id: 'esmaltes', name: 'Esmaltes y Barnices' },
    { id: 'accesorios', name: 'Accesorios' },
];

export default function Catalogo() {
    const [activeCategory, setActiveCategory] = useState('todos');
    const [activeSort, setActiveSort] = useState('destacados');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const filteredProducts = mockProducts
        .filter(p => activeCategory === 'todos' || p.category === activeCategory)
        .sort((a, b) => {
            if (activeSort === 'menor_precio') return a.price - b.price;
            if (activeSort === 'mayor_precio') return b.price - a.price;
            return b.rating - a.rating; // destacados
        });

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
                        <div className="mb-6 flex justify-between items-center bg-card p-4 rounded-xl border border-border">
                            <span className="text-foreground/70 font-medium font-sm">
                                Mostrando <strong className="text-foreground">{filteredProducts.length}</strong> productos
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:border-primary/30 transition-all flex flex-col group"
                                >
                                    <Link href={`/catalogo/${product.id}`} className="block relative group-hover:scale-105 transition-transform duration-500">
                                        <div className="aspect-square bg-gradient-to-tr from-secondary to-muted relative flex items-center justify-center p-6">
                                            <PaintBucket className="w-16 h-16 text-foreground/20" />
                                        </div>
                                    </Link>

                                    <div className="p-5 flex flex-col flex-1">
                                        <p className="text-xs text-foreground/50 font-medium mb-1 uppercase tracking-wider">{product.brand}</p>
                                        <Link href={`/catalogo/${product.id}`} className="hover:text-primary transition-colors">
                                            <h3 className="font-bold text-foreground text-base mb-2 line-clamp-2 leading-tight">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <div className="mt-auto pt-4 flex items-center justify-between">
                                            <span className="font-black text-2xl text-primary">
                                                ${product.price.toLocaleString('es-AR')}
                                            </span>
                                            <button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground p-3 rounded-xl transition-colors shadow-sm cursor-pointer">
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {filteredProducts.length === 0 && (
                                <div className="col-span-full py-12 text-center text-foreground/60">
                                    <PaintBucket className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">No se encontraron productos en esta categoría.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
