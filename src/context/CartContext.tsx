'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
    id: string | number;
    price: number;
    quantity: number;
    [key: string]: unknown;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: CartItem, quantity?: number) => void;
    removeFromCart: (productId: string | number) => void;
    updateQuantity: (productId: string | number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('colorshop_cart');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }, []);

    // Save to localStorage when items change
    useEffect(() => {
        localStorage.setItem('colorshop_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: CartItem, quantity = 1) => {
        setItems(currentItems => {
            const existingProduct = currentItems.find(item => item.id === product.id);
            if (existingProduct) {
                return currentItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...currentItems, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId: string | number) => {
        setItems(currentItems => currentItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: string | number, quantity: number) => {
        if (quantity < 1) return;
        setItems(currentItems =>
            currentItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const value: CartContextType = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};
