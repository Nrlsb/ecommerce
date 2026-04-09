'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, PaintBucket, Menu, X, Search, User, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { totalItems } = useCart();
    const { user, profile, signOut } = useAuth();
    const isAdmin = profile?.rol === 'admin';

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative flex flex-col items-center justify-center">
                            <div className="p-2 bg-primary text-primary-foreground rounded-xl group-hover:bg-primary/90 transition-all shadow-md group-hover:shadow-lg group-hover:-rotate-3">
                                <PaintBucket size={24} />
                            </div>
                            {/* Brand Swoosh decorative element */}
                            <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                                <div className="w-2 h-2 rounded-full bg-mercurio-pink shadow-sm"></div>
                                <div className="w-2 h-2 rounded-full bg-mercurio-yellow shadow-sm"></div>
                                <div className="w-2 h-2 rounded-full bg-mercurio-green shadow-sm"></div>
                            </div>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-2xl font-black italic tracking-tighter text-primary">
                                mercurio
                            </span>
                            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary/70">
                                pinturerías
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/catalogo" className="text-foreground/80 hover:text-primary transition-colors font-medium">Catálogo</Link>
                        <Link href="/ofertas" className="text-foreground/80 hover:text-primary transition-colors font-medium">Ofertas</Link>
                        <Link href="/marcas" className="text-foreground/80 hover:text-primary transition-colors font-medium">Marcas</Link>
                        <Link href="/contacto" className="text-foreground/80 hover:text-primary transition-colors font-medium">Contacto</Link>
                        {isAdmin && (
                            <Link href="/admin" className="text-primary hover:text-primary/80 transition-colors font-bold flex items-center gap-1">
                                <ShieldCheck size={18} />
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Icons Context */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-foreground/80 hover:text-primary transition-colors">
                            <Search size={20} />
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-foreground/60 hidden lg:inline-block max-w-[150px] truncate">
                                    {user.email}
                                </span>
                                <button
                                    onClick={() => signOut()}
                                    className="text-foreground/80 hover:text-destructive transition-colors text-sm font-bold"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="text-foreground/80 hover:text-primary transition-colors">
                                <User size={20} />
                            </Link>
                        )}

                        <Link href="/carrito" className="text-foreground/80 hover:text-primary transition-colors relative">
                            <ShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
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
                                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
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
                            {isAdmin && (
                                <Link href="/admin" className="px-3 py-3 rounded-md text-base font-bold text-primary hover:bg-secondary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                    Panel Admin
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
