'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, PaintBucket, Menu, X, Search, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { totalItems } = useCart();

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-primary text-primary-foreground rounded-xl group-hover:bg-accent transition-colors">
                            <PaintBucket size={24} />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            ColorShop
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/catalogo" className="text-foreground/80 hover:text-primary transition-colors font-medium">Catálogo</Link>
                        <Link href="/ofertas" className="text-foreground/80 hover:text-primary transition-colors font-medium">Ofertas</Link>
                        <Link href="/marcas" className="text-foreground/80 hover:text-primary transition-colors font-medium">Marcas</Link>
                        <Link href="/contacto" className="text-foreground/80 hover:text-primary transition-colors font-medium">Contacto</Link>
                    </div>

                    {/* Icons Context */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-foreground/80 hover:text-primary transition-colors">
                            <Search size={20} />
                        </button>
                        <button className="text-foreground/80 hover:text-primary transition-colors">
                            <User size={20} />
                        </button>
                        <Link href="/carrito" className="text-foreground/80 hover:text-primary transition-colors relative">
                            <ShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link href="/carrito" className="text-foreground/80 relative">
                            <ShoppingCart size={24} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-foreground/80 hover:text-primary transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu via Framer Motion */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b border-border overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-1 flex flex-col">
                            <Link href="/catalogo" className="px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                Catálogo
                            </Link>
                            <Link href="/ofertas" className="px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                Ofertas
                            </Link>
                            <Link href="/marcas" className="px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                Marcas
                            </Link>
                            <Link href="/contacto" className="px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                Contacto
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
