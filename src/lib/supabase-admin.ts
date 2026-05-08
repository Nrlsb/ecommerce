import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Cliente de Supabase con Service Role Key para operaciones administrativas (bypass RLS)
// Solo debe usarse en entornos de servidor (API routes, Server Actions, etc.)
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
