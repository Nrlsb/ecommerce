'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: any;
    profile: any;
    loading: boolean;
    signUp: (email: string, password: string, nombre?: string) => Promise<{ error?: any }>;
    signIn: (email: string, password: string) => Promise<{ error?: any }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    signUp: async () => ({}),
    signIn: async () => ({}),
    signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            try {
                // Intentar cargar desde localStorage como cache rápido
                const storedUser = localStorage.getItem('auth_user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    setProfile(JSON.parse(storedUser));
                }

                // Verificar sesión real con el servidor (Cookie HttpOnly)
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    setProfile(data.user);
                    localStorage.setItem('auth_user', JSON.stringify(data.user));
                } else {
                    // Si el servidor dice que no hay sesión, limpiar local
                    setUser(null);
                    setProfile(null);
                    localStorage.removeItem('auth_user');
                }
            } catch (error) {
                console.error('Error loading session:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSession();
    }, []);

    const signUp = async (email: string, password: string, nombre?: string) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, nombre }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { error: new Error(data.error || 'Error al registrarse') };
            }

            const newUser = data.user;
            setUser(newUser);
            setProfile(newUser);
            localStorage.setItem('auth_user', JSON.stringify(newUser));
            
            return {};
        } catch (error) {
            return { error };
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { error: new Error(data.error || 'Credenciales inválidas') };
            }

            const loggedUser = data.user;
            setUser(loggedUser);
            setProfile(loggedUser);
            localStorage.setItem('auth_user', JSON.stringify(loggedUser));

            return {};
        } catch (error) {
            return { error };
        }
    };

    const signOut = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Error signing out from server:', error);
        }
        setUser(null);
        setProfile(null);
        localStorage.removeItem('auth_user');
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
