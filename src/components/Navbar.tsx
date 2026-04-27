'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, PaintBucket, Menu, X, Search, User, ShieldCheck, Sun, Moon, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { PRODUCT_CATEGORIES_HIERARCHY } from '@/config/categories';

export default function Navbar() {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeHoverGroup, setActiveHoverGroup] = useState<string | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);
    const { totalItems } = useCart();
    const { user, profile, signOut } = useAuth();
    const isAdmin = profile?.rol?.toLowerCase() === 'admin';

    // Initial theme setup
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        if (initialTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

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
                        <Link href="/catalogo" className="text-foreground/80 hover:text-primary transition-colors font-bold text-sm uppercase tracking-wider">Catálogo</Link>
                        <Link href="/ofertas" className="text-foreground/80 hover:text-primary transition-colors font-bold text-sm uppercase tracking-wider">Ofertas</Link>
                        {isAdmin && (
                            <Link href="/admin" className="text-primary hover:text-primary/80 transition-colors font-bold flex items-center gap-1 text-sm uppercase tracking-wider">
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

                        <button 
                            onClick={toggleTheme}
                            className="text-foreground/80 hover:text-primary transition-colors p-2 rounded-full hover:bg-secondary"
                            aria-label="Cambiar tema"
                        >
                            {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-foreground/60 hidden lg:inline-block max-w-[150px] truncate">
                                    {user.email}
                                </span>
                                <button
                                    onClick={async () => {
                                        await signOut();
                                        router.push('/');
                                    }}
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

            {/* Categorías Desktop Bar */}
            <div className="hidden md:block bg-primary/5 border-t border-border/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-start items-center h-12 space-x-1">
                        {PRODUCT_CATEGORIES_HIERARCHY.map((group) => (
                            <div 
                                key={group.slug}
                                className="relative h-full flex items-center"
                                onMouseEnter={() => setActiveHoverGroup(group.slug)}
                                onMouseLeave={() => setActiveHoverGroup(null)}
                            >
                                <button
                                    onClick={() => router.push(`/catalogo?categoria=${group.slug}`)}
                                    className={`px-6 h-full flex items-center gap-2 text-[13px] font-black tracking-tight transition-colors border-b-2 border-transparent hover:text-primary ${
                                        activeHoverGroup === group.slug ? 'text-primary border-primary bg-primary/5' : 'text-foreground/70'
                                    }`}
                                >
                                    {group.name}
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeHoverGroup === group.slug ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {activeHoverGroup === group.slug && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 w-64 bg-background border border-border rounded-b-2xl shadow-2xl overflow-hidden py-4 z-[100]"
                                        >
                                            <div className="flex flex-col">
                                                {group.subcategories.map((sub) => (
                                                    <Link
                                                        key={sub.slug}
                                                        href={`/catalogo?categoria=${sub.slug}`}
                                                        className="px-6 py-3 text-sm font-bold text-foreground/70 hover:text-primary hover:bg-secondary transition-all flex items-center justify-between group/item"
                                                    >
                                                        {sub.name}
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
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
