import { Loader2, PaintBucket, Filter } from 'lucide-react';
import { ProductCard } from './ProductCard';
import Skeleton from '../ui/Skeleton';

interface Product {
  id: string;
  nombre: string;
  precio: number;
  marca?: string;
  imagen_url?: string;
}

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isInitialLoading: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  onAddToCart: (product: Product) => void;
  pageSize: number;
}

export function ProductGrid({
  products,
  isLoading,
  isInitialLoading,
  error,
  hasMore,
  onLoadMore,
  onAddToCart,
  pageSize,
}: ProductGridProps) {
  if (isInitialLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card rounded-[2rem] p-5 border border-border space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-full" />
              <div className="flex justify-between items-center pt-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center bg-card p-4 rounded-xl border border-border">
        <span className="text-foreground/70 font-medium text-sm">
          {error ? (
            <span className="text-destructive font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" /> {error}
            </span>
          ) : (
            <>
              Encontrados <strong className="text-foreground">{products.length}</strong> productos
            </>
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            delay={(idx % pageSize) * 0.05}
            onAddToCart={onAddToCart}
          />
        ))}

        {products.length === 0 && (
          <div className="col-span-full py-12 text-center text-foreground/60">
            <PaintBucket className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No se encontraron productos con estos filtros.</p>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Cargando...
              </>
            ) : (
              'Cargar más productos'
            )}
          </button>
        </div>
      )}
    </>
  );
}
