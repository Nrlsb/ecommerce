'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface WishlistContextType {
  wishlist: any[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing wishlist', e);
      }
    }
  }, []);

  const addToWishlist = (product: any) => {
    setWishlist((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      const next = [...prev, product];
      localStorage.setItem('wishlist', JSON.stringify(next));
      return next;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.filter((p) => String(p.id) !== String(productId));
      localStorage.setItem('wishlist', JSON.stringify(next));
      return next;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => String(p.id) === String(productId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
