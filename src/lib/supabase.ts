import { createClient } from '@supabase/supabase-js';
import { env } from './env';

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);

// Cliente con privilegios administrativos para procesos de servidor
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
