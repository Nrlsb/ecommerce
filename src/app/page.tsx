import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesBar } from '@/components/home/FeaturesBar';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { supabase } from '@/lib/supabase';

// Forzar revalidación de la página principal bajo demanda u optimizar con ISR
export const revalidate = 3600; // Revalidar cada hora (ISR)

async function getFeaturedProducts() {
  try {
    let { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('destacado', true)
      .not('imagen_url', 'is', null)
      .neq('imagen_url', '')
      .limit(4);

    if (error) throw error;
    
    if (data && data.length > 0) {
      return data;
    } else {
      const { data: latestData, error: latestError } = await supabase
        .from('productos')
        .select('*')
        .not('imagen_url', 'is', null)
        .neq('imagen_url', '')
        .order('id', { ascending: false })
        .limit(4);
      
      if (latestError) throw latestError;
      return latestData || [];
    }
  } catch (err) {
    console.error('Error fetching featured products on Server Component:', err);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Animado (Client Component) */}
      <HeroSection />

      {/* Barra de Características Animada (Client Component) */}
      <FeaturesBar />

      {/* Cuadrícula de Categorías (Client Component) */}
      <CategoriesGrid />

      {/* Lista de Productos Destacados (Client Component, recibe data precargada) */}
      <FeaturedProducts initialProducts={featuredProducts} />
    </div>
  );
}
