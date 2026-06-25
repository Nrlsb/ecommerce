'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, AlertCircle, User } from 'lucide-react';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signIn, signUp, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = isLogin
                ? await signIn(email, password)
                : await signUp(email, password, nombre);

            if (authError) throw authError;

            // La redirección ocurrirá por el useEffect al cambiar el estado 'user'
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 bg-card rounded-[2.5rem] border border-border/80 shadow-premium relative overflow-hidden premium-border-hover">
            {/* Background Glows internally */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-gradient-to-tr from-mercurio-pink/10 to-mercurio-blue/5 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-gradient-to-tr from-mercurio-yellow/5 to-mercurio-pink/5 rounded-full blur-2xl opacity-40 pointer-events-none"></div>

            <div className="text-center mb-8 relative z-10">
                <h2 className="text-3xl font-black text-foreground tracking-tight uppercase font-display bg-gradient-to-r from-foreground via-slate-800 to-slate-650 bg-clip-text text-transparent">
                    {isLogin ? '¡Hola de nuevo!' : 'Creá tu cuenta'}
                </h2>
                <p className="text-foreground/60 mt-2 text-sm font-light leading-relaxed">
                    {isLogin ? 'Ingresá tus credenciales para continuar' : 'Unite a nuestra comunidad de pintores'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <AnimatePresence initial={false}>
                    {!isLogin && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="space-y-1.5 overflow-hidden"
                        >
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-1">Nombre</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-muted/30 text-foreground border border-border/60 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium placeholder:text-muted-foreground/40 text-sm shadow-inner"
                                    placeholder="Tu nombre completo"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-muted/30 text-foreground border border-border/60 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium placeholder:text-muted-foreground/40 text-sm shadow-inner"
                            placeholder="tu@email.com"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-1">Contraseña</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-muted/30 text-foreground border border-border/60 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium placeholder:text-muted-foreground/40 text-sm shadow-inner"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-4 flex items-start gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-650 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-705 dark:text-red-400 text-xs font-light leading-relaxed">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary text-primary-foreground font-black tracking-widest rounded-xl transition-all duration-300 disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase shadow-lg hover:scale-[1.02] active:scale-95 btn-premium-glow btn-premium-glow-primary"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        isLogin ? 'Iniciar Sesión' : 'Registrarse'
                    )}
                </button>
            </form>

            <div className="mt-8 text-center border-t border-border/40 pt-6 relative z-10">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-xs font-black uppercase tracking-widest text-primary hover:text-mercurio-pink transition-colors cursor-pointer"
                >
                    {isLogin ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión'}
                </button>
            </div>
        </div>
    );
}
