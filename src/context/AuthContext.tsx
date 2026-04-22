'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    user: { id: string; email: string } | null;
    profile: { id: string; rol: string } | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<any>;
    signIn: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    signUp: async () => {},
    signIn: async () => {},
    signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('perfiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            console.log('Perfil cargado para:', userId, 'Rol:', data.rol);
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error instanceof Error ? error.message : String(error));
            setProfile(null);
        }
    };

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                await fetchProfile(currentUser.id);
            }
            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                await fetchProfile(currentUser.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = (email: string, password: string) => supabase.auth.signUp({ email, password });
    const signIn = (email: string, password: string) => supabase.auth.signInWithPassword({ email, password });
    const signOut = async () => {
        try {
            console.log('Iniciando cierre de sesión...');
            await supabase.auth.signOut();
            setProfile(null);
            setUser(null);
            console.log('Sesión cerrada correctamente');
        } catch (error) {
            console.error('Error al cerrar sesión:', error instanceof Error ? error.message : String(error));
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
