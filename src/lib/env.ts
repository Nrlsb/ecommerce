export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  paywayPublicKey: process.env.NEXT_PUBLIC_PAYWAY_PUBLIC_KEY || '',
  paywayPrivateKey: process.env.PAYWAY_PRIVATE_KEY || '',
  paywayWebhookSecret: process.env.PAYWAY_WEBHOOK_SECRET || '',
  paywayEnv: process.env.NEXT_PUBLIC_PAYWAY_ENV || 'sandbox',
} as const;

// Validación para asegurar que las variables están presentes
if (typeof window === 'undefined') {
  // Validación del lado del Servidor
  if (!env.supabaseUrl || !env.supabaseAnonKey || !env.supabaseServiceRoleKey) {
    console.error('❌ Error: Variables de Supabase incompletas en el servidor.');
  } else {
    console.log('✅ Supabase configurado en el servidor:', env.supabaseUrl.substring(0, 20) + '...');
  }

  if (!env.paywayPublicKey || !env.paywayPrivateKey) {
    console.warn('⚠️ Advertencia: Variables de Payway (pública o privada) incompletas en el servidor.');
  }
} else {
  // Validación del lado del Cliente (Navegador)
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    console.error('❌ Error: Variables de Supabase incompletas en el navegador.');
  } else {
    console.log('✅ Supabase configurado en el navegador:', env.supabaseUrl.substring(0, 20) + '...');
  }

  if (!env.paywayPublicKey) {
    console.warn('⚠️ Advertencia: NEXT_PUBLIC_PAYWAY_PUBLIC_KEY no está configurada en el cliente.');
  }
}
