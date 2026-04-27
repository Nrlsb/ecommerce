import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!serviceRoleKey || serviceRoleKey === 'tu_clave_secreta_aqui') {
    console.warn("⚠️ Advertencia: SUPABASE_SERVICE_ROLE_KEY no está configurada correctamente en .env");
}

/**
 * Cliente de Supabase con privilegios de administrador.
 * Se salta las políticas de RLS.
 * IMPORTANTE: Solo debe usarse en API Routes (lado del servidor).
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
