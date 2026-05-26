'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Menu, X, User, ShieldCheck, Sun, Moon, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { PRODUCT_CATEGORIES_HIERARCHY } from '@/config/categories';
import { GlobalSearch } from '@/components/ui/GlobalSearch';

export default function Navbar() {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeHoverGroup, setActiveHoverGroup] = useState<string | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
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

        // Scroll listener
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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

    // Stagger animation variants for mobile menu
    const menuVariants: Variants = {
        hidden: { opacity: 0, x: '100%' },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20,
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            x: '100%',
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20,
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    };

    const linkVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
    };

    return (
        <nav className={`sticky top-0 z-50 w-full glass transition-all duration-500 ${isScrolled ? 'py-0.5 shadow-lg bg-background/90 backdrop-blur-2xl border-b border-border/40' : 'py-2 shadow-premium'}`}>
            {/* Top accent line with brand colors */}
            <div className="h-1 w-full flex absolute top-0 left-0 right-0">
                <div className="h-full flex-1 bg-mercurio-blue" />
                <div className="h-full flex-1 bg-mercurio-yellow" />
                <div className="h-full flex-1 bg-mercurio-green" />
                <div className="h-full flex-1 bg-mercurio-pink" />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-1">
                <div className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? 'h-14' : 'h-16'}`}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="relative flex items-center justify-center">
                            <img 
                                src="/images/logos/logomercurio.png" 
                                alt="Mercurio Pinturerías" 
                                className={`w-auto transition-all duration-500 group-hover:scale-105 ${isScrolled ? 'h-8' : 'h-10'}`} 
                            />
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/catalogo" className="text-foreground/50 hover:text-primary transition-all font-display font-bold text-[12px] uppercase tracking-[0.25em] relative group/link py-2">
                            Catálogo
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover/link:w-8" />
                        </Link>
                        <Link href="/ofertas" className="text-foreground/50 hover:text-primary transition-all font-display font-bold text-[12px] uppercase tracking-[0.25em] relative group/link py-2">
                            Ofertas
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover/link:w-8" />
                        </Link>
                        <Link href="/servicios" className="text-foreground/50 hover:text-primary transition-all font-display font-bold text-[12px] uppercase tracking-[0.25em] relative group/link py-2">
                            Servicios
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover/link:w-8" />
                        </Link>
                        {isAdmin && (
                            <Link href="/admin" className="group flex items-center gap-2 text-[11px] font-display font-bold uppercase tracking-widest bg-primary text-white px-5 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                <ShieldCheck size={16} className="group-hover:rotate-12 transition-transform" />
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Icons Context */}
                    <div className="hidden md:flex items-center space-x-5">
                        <GlobalSearch />

                        <button 
                            onClick={toggleTheme}
                            className="text-foreground/40 hover:text-primary transition-all p-2.5 rounded-xl hover:bg-primary/5 active:scale-90"
                            aria-label="Cambiar tema"
                        >
                            {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-6">
                                <span className="text-xs font-display font-bold text-foreground/30 hidden lg:inline-block max-w-[150px] truncate uppercase tracking-widest">
                                    {user.email}
                                </span>
                                <button
                                    onClick={async () => {
                                        await signOut();
                                        router.push('/');
                                    }}
                                    className="text-foreground/60 hover:text-destructive transition-all text-[11px] font-display font-bold uppercase tracking-widest bg-secondary px-4 py-2 rounded-lg"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="text-foreground/40 hover:text-primary transition-all hover:scale-110 p-2">
                                <User size={20} />
                            </Link>
                        )}

                        <Link href="/carrito" className="text-foreground/60 hover:text-primary transition-all relative p-2.5 bg-primary/5 rounded-xl border border-primary/5 hover:border-primary/20 group/cart">
                            <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] font-display font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-accent/20 border-2 border-white dark:border-slate-900">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link href="/carrito" className="text-foreground/60 relative p-2">
                            <ShoppingCart size={24} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-foreground/60 hover:text-primary transition-all p-2 z-50"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Categorías Desktop Bar - Refined */}
            <div className="hidden md:block border-t border-border/50 bg-white/50 dark:bg-slate-950/20 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-11 space-x-1">
                        {PRODUCT_CATEGORIES_HIERARCHY.map((group) => (
                            <div 
                                key={group.slug}
                                className="relative h-full flex items-center"
                                onMouseEnter={() => setActiveHoverGroup(group.slug)}
                                onMouseLeave={() => setActiveHoverGroup(null)}
                            >
                                <button
                                    onClick={() => router.push(`/catalogo?categoria=${group.slug}`)}
                                    className={`px-6 h-full flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-[0.15em] transition-all relative group/cat ${
                                        activeHoverGroup === group.slug ? 'text-primary' : 'text-foreground/50 hover:text-foreground/80'
                                    }`}
                                >
                                    {group.name}
                                    <ChevronDown size={12} className={`transition-transform duration-500 ${activeHoverGroup === group.slug ? 'rotate-180 text-primary opacity-100' : 'opacity-20 group-hover/cat:opacity-100'}`} />
                                    {activeHoverGroup === group.slug && (
                                        <motion.div layoutId="nav-active" className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(30,55,115,0.3)]" />
                                    )}
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

            {/* Mobile Menu via Framer Motion (Full Screen Overlay) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl flex flex-col justify-center items-center md:hidden"
                    >
                        <div className="flex flex-col items-center gap-8 w-full max-w-sm px-6 text-center">
                            {/* Decorative element inside mobile menu */}
                            <img src="/images/logos/logomercurio.png" alt="Mercurio" className="h-12 w-auto mb-6 opacity-30" />

                            <motion.div variants={linkVariants} className="w-full">
                                <Link 
                                    href="/catalogo" 
                                    className="block py-4 text-2xl font-display font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors border-b border-border/50" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Catálogo
                                </Link>
                            </motion.div>
                            <motion.div variants={linkVariants} className="w-full">
                                <Link 
                                    href="/ofertas" 
                                    className="block py-4 text-2xl font-display font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors border-b border-border/50" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Ofertas
                                </Link>
                            </motion.div>
                            <motion.div variants={linkVariants} className="w-full">
                                <Link 
                                    href="/servicios" 
                                    className="block py-4 text-2xl font-display font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors border-b border-border/50" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Servicios
                                </Link>
                            </motion.div>
                            <motion.div variants={linkVariants} className="w-full">
                                <Link 
                                    href="/contacto" 
                                    className="block py-4 text-2xl font-display font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors border-b border-border/50" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Contacto
                                </Link>
                            </motion.div>

                            {isAdmin && (
                                <motion.div variants={linkVariants} className="w-full">
                                    <Link 
                                        href="/admin" 
                                        className="block py-4 text-2xl font-display font-bold uppercase tracking-widest text-primary hover:text-primary-foreground hover:bg-primary rounded-xl transition-all" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Panel Admin
                                    </Link>
                                </motion.div>
                            )}

                            {/* Theme selector in mobile menu */}
                            <motion.div variants={linkVariants} className="mt-8 flex items-center gap-4">
                                <span className="text-sm font-semibold text-foreground/40">Tema:</span>
                                <button 
                                    onClick={toggleTheme}
                                    className="p-3 bg-secondary rounded-xl text-foreground flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                                >
                                    {mounted && theme === 'dark' ? (
                                        <>
                                            <Sun size={20} className="text-mercurio-yellow" />
                                            <span>Claro</span>
                                        </>
                                    ) : (
                                        <>
                                            <Moon size={20} className="text-mercurio-blue" />
                                            <span>Oscuro</span>
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
