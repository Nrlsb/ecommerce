import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('ERROR: Supabase URL u Anon Key no están configurados. Verifica tus variables de entorno.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
