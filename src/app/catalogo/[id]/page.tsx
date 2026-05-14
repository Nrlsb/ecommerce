import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProductDetailClient from '@/components/products/ProductDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('productos')
    .select('*, categorias(nombre)')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  const title = `${product.nombre} | ${product.marca || 'Mercurio'}`;
  const description = product.descripcion || `Compra ${product.nombre} al mejor precio en Pinturerías Mercurio. Calidad profesional para tus proyectos.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.imagen_url ? [{ url: product.imagen_url }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.imagen_url ? [product.imagen_url] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  return (
    <ProductDetailClient 
      productId={resolvedParams.id} 
      initialProduct={product} 
    />
  );
}
