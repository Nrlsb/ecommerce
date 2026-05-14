import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pintureriamercurio.com.ar';

  // Rutas estáticas
  const staticRoutes = [
    '',
    '/catalogo',
    '/ofertas',
    '/contacto',
    '/arrepentimiento',
    '/sucursales',
    '/sobre-mercurio',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Rutas dinámicas de productos
  try {
    const { data: products } = await supabase
      .from('productos')
      .select('id')
      .limit(1000);

    const productRoutes = (products || []).map((p) => ({
      url: `${baseUrl}/catalogo/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    return staticRoutes;
  }
}
