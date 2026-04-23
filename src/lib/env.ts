export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
} as const;

// Validación para asegurar que las variables están presentes
if (!env.supabaseUrl || !env.supabaseAnonKey) {
  const errorMsg = 'Error: NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY no están definidas.';

  if (typeof window === 'undefined') {
    // En el servidor (build time / server side) lanzamos error
    console.error(errorMsg);
  } else {
    // En el  cliente, informamos por consola si algo falló
    console.error(errorMsg);
  }
}
