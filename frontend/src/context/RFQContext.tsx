import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RFQItem {
  id?: number | string;
  slug: string;
  chemical_name: string;
  cas_number?: string;
  category?: string;
  grade?: string;
  quantity?: string;
  unit?: string;
  notes?: string;
}

interface RFQContextType {
  items: RFQItem[];
  addItem: (item: RFQItem) => void;
  removeItem: (slug: string) => void;
  updateItem: (slug: string, updates: Partial<RFQItem>) => void;
  clearBasket: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  isInBasket: (slug: string) => boolean;
  totalCount: number;
}

const RFQContext = createContext<RFQContextType | undefined>(undefined);

const STORAGE_KEY = 'aura_rfq_basket_v1';

export const RFQProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<RFQItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist RFQ basket to localStorage', e);
    }
  }, [items]);

  const addItem = (item: RFQItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.slug === item.slug);
      if (exists) {
        return prev;
      }
      return [...prev, { ...item, quantity: item.quantity || '500', unit: item.unit || 'kg' }];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  };

  const updateItem = (slug: string, updates: Partial<RFQItem>) => {
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, ...updates } : i))
    );
  };

  const clearBasket = () => {
    setItems([]);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const isInBasket = (slug: string) => items.some((i) => i.slug === slug);

  return (
    <RFQContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItem,
        clearBasket,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        isInBasket,
        totalCount: items.length,
      }}
    >
      {children}
    </RFQContext.Provider>
  );
};

export const useRFQ = (): RFQContextType => {
  const context = useContext(RFQContext);
  if (!context) {
    throw new Error('useRFQ must be used within an RFQProvider');
  }
  return context;
};
