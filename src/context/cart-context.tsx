'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { type Plugin } from '../modules/plugins/plugin-types';
import { type Tool } from '../modules/tools/tool-types';

interface CartItem {
  productType: 'plugin' | 'tool';
  id: string;
  slug: string;
  name: string;
  price: string;
  priceCents: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Plugin | Tool) => { success: boolean; message: string };
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => string;
  getItemCount: () => number;
  isProductInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const storedCart = localStorage.getItem('fern-cart');
      if (storedCart) {
        const parsedItems = JSON.parse(storedCart) as CartItem[];
        setItems(parsedItems);
      }
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('fern-cart', JSON.stringify(items));
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error);
    }
  }, [items]);

  const addToCart = useCallback((product: Plugin | Tool) => {
    let success = true;
    let message = 'Added to cart';
    
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        success = false;
        message = 'This item is already in your cart.';
        return prevItems; // Don't add duplicate
      }
      
      // Convert product to CartItem format
      const cartItem: CartItem = {
        productType: 'priceCents' in product ? 'tool' : 'plugin',
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: 'priceCents' in product ? `$${((product.priceCents || 0) / 100).toFixed(0)}` : product.price,
        priceCents: 'priceCents' in product ? (product.priceCents || 0) : parseInt(product.price.replace(/[^0-9]/g, '')) * 100,
        quantity: 1,
      };
      
      return [...prevItems, cartItem];
    });
    
    return { success, message };
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    // Explicitly remove from localStorage to ensure complete clearing
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fern-cart');
    }
  }, []);

  const getTotalPrice = useCallback(() => {
    const total = items.reduce((sum, item) => {
      return sum + (item.priceCents * item.quantity);
    }, 0);
    return `$${(total / 100).toFixed(2)}`;
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const isProductInCart = useCallback((id: string) => {
    return items.some(item => item.id === id);
  }, [items]);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getItemCount,
    isProductInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
