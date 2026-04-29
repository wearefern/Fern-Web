'use client';

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Plugin, getPluginBySlug } from '../../data/plugins-data';

const CART_STORAGE_KEY = 'fern.plugins.cart';
const PURCHASED_STORAGE_KEY = 'fern.plugins.purchased';

interface CartContextValue {
  cartItems: Plugin[];
  purchasedPlugins: Plugin[];
  addToCart: (plugin: Plugin) => 'added' | 'duplicate';
  removeFromCart: (slug: string) => void;
  completePurchase: () => void;
  isInCart: (slug: string) => boolean;
  isPurchased: (slug: string) => boolean;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const readStoredSlugs = (key: string) => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
};

const writeStoredSlugs = (key: string, slugs: string[]) => {
  window.localStorage.setItem(key, JSON.stringify(slugs));
};

const slugsToPlugins = (slugs: string[]) =>
  slugs
    .map((slug) => getPluginBySlug(slug))
    .filter((plugin): plugin is Plugin => Boolean(plugin));

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [cartSlugs, setCartSlugs] = useState<string[]>([]);
  const [purchasedSlugs, setPurchasedSlugs] = useState<string[]>([]);

  useEffect(() => {
    setCartSlugs(readStoredSlugs(CART_STORAGE_KEY));
    setPurchasedSlugs(readStoredSlugs(PURCHASED_STORAGE_KEY));
  }, []);

  const addToCart = useCallback((plugin: Plugin) => {
    if (cartSlugs.includes(plugin.slug)) {
      return 'duplicate';
    }

    const nextCartSlugs = [...cartSlugs, plugin.slug];
    setCartSlugs(nextCartSlugs);
    writeStoredSlugs(CART_STORAGE_KEY, nextCartSlugs);
    return 'added';
  }, [cartSlugs]);

  const removeFromCart = useCallback((slug: string) => {
    setCartSlugs((currentSlugs) => {
      const nextCartSlugs = currentSlugs.filter((item) => item !== slug);
      writeStoredSlugs(CART_STORAGE_KEY, nextCartSlugs);
      return nextCartSlugs;
    });
  }, []);

  const completePurchase = useCallback(() => {
    setPurchasedSlugs((currentSlugs) => {
      const nextPurchasedSlugs = Array.from(new Set([...currentSlugs, ...cartSlugs]));
      writeStoredSlugs(PURCHASED_STORAGE_KEY, nextPurchasedSlugs);
      writeStoredSlugs(CART_STORAGE_KEY, []);
      return nextPurchasedSlugs;
    });
    setCartSlugs([]);
  }, [cartSlugs]);

  const value = useMemo<CartContextValue>(() => {
    const cartItems = slugsToPlugins(cartSlugs);
    const purchasedPlugins = slugsToPlugins(purchasedSlugs);

    return {
      cartItems,
      purchasedPlugins,
      addToCart,
      removeFromCart,
      completePurchase,
      isInCart: (slug) => cartSlugs.includes(slug),
      isPurchased: (slug) => purchasedSlugs.includes(slug),
      total: cartItems.reduce((sum, plugin) => sum + plugin.price, 0),
    };
  }, [addToCart, cartSlugs, completePurchase, purchasedSlugs, removeFromCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
};
