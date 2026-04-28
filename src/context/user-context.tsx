'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { type Plugin } from '../data/plugins-data';

interface Order {
  id: string;
  date: string;
  items: {
    plugin: Plugin;
    quantity: number;
    price: string;
  }[];
  total: string;
  status: 'completed' | 'pending';
}

interface UserContextType {
  orders: Order[];
  purchasedPlugins: string[]; // Array of plugin IDs
  addOrder: (order: Order) => void;
  isPluginPurchased: (pluginId: string) => boolean;
  getOrders: () => Order[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [purchasedPlugins, setPurchasedPlugins] = useState<string[]>([]);

  const addOrder = (order: Order) => {
    setOrders(prevOrders => [order, ...prevOrders]);
    
    // Add plugin IDs to purchased plugins
    const newPluginIds = order.items.map(item => item.plugin.id);
    setPurchasedPlugins(prev => [...new Set([...prev, ...newPluginIds])]);
  };

  const isPluginPurchased = (pluginId: string) => {
    return purchasedPlugins.includes(pluginId);
  };

  const getOrders = () => orders;

  const value: UserContextType = {
    orders,
    purchasedPlugins,
    addOrder,
    isPluginPurchased,
    getOrders,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
