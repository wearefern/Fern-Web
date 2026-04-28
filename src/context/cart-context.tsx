'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { type Plugin } from '../data/plugins-data';

interface CartItem {
  plugin: Plugin;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (plugin: Plugin) => { success: boolean; message: string };
  removeFromCart: (pluginId: string) => void;
  updateQuantity: (pluginId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => string;
  getItemCount: () => number;
  isPluginInCart: (pluginId: string) => boolean;
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

  const addToCart = (plugin: Plugin) => {
    let success = true;
    let message = 'Added to cart';
    
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.plugin.id === plugin.id);
      if (existingItem) {
        success = false;
        message = 'This plugin is already in your cart.';
        return prevItems; // Don't add duplicate
      }
      return [...prevItems, { plugin, quantity: 1 }]; // Always quantity 1
    });
    
    return { success, message };
  };

  const removeFromCart = (pluginId: string) => {
    setItems(prevItems => prevItems.filter(item => item.plugin.id !== pluginId));
  };

  const updateQuantity = (pluginId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(pluginId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.plugin.id === pluginId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.plugin.price.replace('$', ''));
      return sum + (price * item.quantity);
    }, 0);
    return `$${total.toFixed(2)}`;
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const isPluginInCart = (pluginId: string) => {
    return items.some(item => item.plugin.id === pluginId);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getItemCount,
    isPluginInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
