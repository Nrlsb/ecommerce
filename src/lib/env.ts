export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  paywayPublicKey: process.env.NEXT_PUBLIC_PAYWAY_PUBLIC_KEY || '',
  paywayPrivateKey: process.env.PAYWAY_PRIVATE_KEY || '',
  paywayWebhookSecret: process.env.PAYWAY_WEBHOOK_SECRET || '',
  paywayEnv: process.env.NEXT_PUBLIC_PAYWAY_ENV || 'sandbox',
  protheusApiUrl: process.env.PROTHEUS_API_URL || 'http://119.8.78.68:8081/rest/MERWS01G/',
  protheusShippingUrl: process.env.PROTHEUS_SHIPPING_URL || 'http://119.8.78.68:8081/rest/MERWS01H/',
  protheusSyncCategoriesUrl: process.env.PROTHEUS_SYNC_CATEGORIES_URL || 'http://119.8.78.68:8081/rest/MERWS01D',
  protheusSyncProductsUrl: process.env.PROTHEUS_SYNC_PRODUCTS_URL || 'http://119.8.78.68:8081/rest/MERWS01B',
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

  if (!process.env.PROTHEUS_API_URL) {
    console.warn('⚠️ Advertencia: PROTHEUS_API_URL no está configurada en el servidor. Utilizando URL por defecto.');
  }

  if (!process.env.PROTHEUS_SHIPPING_URL) {
    console.warn('⚠️ Advertencia: PROTHEUS_SHIPPING_URL no está configurada en el servidor. Utilizando URL por defecto.');
  }

  if (!process.env.PROTHEUS_SYNC_CATEGORIES_URL) {
    console.warn('⚠️ Advertencia: PROTHEUS_SYNC_CATEGORIES_URL no está configurada en el servidor. Utilizando URL por defecto.');
  }

  if (!process.env.PROTHEUS_SYNC_PRODUCTS_URL) {
    console.warn('⚠️ Advertencia: PROTHEUS_SYNC_PRODUCTS_URL no está configurada en el servidor. Utilizando URL por defecto.');
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
