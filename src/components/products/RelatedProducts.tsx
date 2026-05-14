'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/catalogo/ProductCard';
import { motion } from 'framer-motion';

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string;
}

export default function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .eq('categoria_id', categoryId)
          .neq('id', currentProductId)
          .limit(4);

        if (!error && data) {
          setProducts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) fetchRelated();
  }, [currentProductId, categoryId]);

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="mt-32">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">También te puede interesar</h2>
          <p className="text-foreground/60">Productos complementarios para tu proyecto</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-[2rem]" />
          ))
        ) : (
          products.map((product, idx) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              delay={idx * 0.1} 
              onAddToCart={() => {}} 
            />
          ))
        )}
      </div>
    </section>
  );
}
