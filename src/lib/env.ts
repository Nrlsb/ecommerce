export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
} as const;

// Validación para asegurar que las variables están presentes
if (!env.supabaseUrl || !env.supabaseAnonKey) {
  const errorMsg = '❌ Error: NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY no están definidas.';
  console.error(errorMsg);
} else {
  console.log('✅ Supabase configurado:', env.supabaseUrl.substring(0, 20) + '...');
}
