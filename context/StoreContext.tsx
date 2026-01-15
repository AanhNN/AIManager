import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Account, ProductAccount } from '../types';
import { storage } from '../services/storage';

interface StoreContextType {
  products: Product[];
  accounts: Account[];
  productAccounts: ProductAccount[];
  addProduct: (name: string, description: string) => void;
  updateProduct: (id: string, name: string, description: string) => void;
  deleteProduct: (id: string) => void;
  linkAccountToProduct: (productId: string, email: string) => void;
  unlinkAccount: (relationId: string) => void;
  startCountdown: (accountId: string, days: number) => void;
  resetCountdown: (accountId: string) => void;
  refreshData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper to generate IDs safely in all environments
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [productAccounts, setProductAccounts] = useState<ProductAccount[]>([]);

  const refreshData = useCallback(() => {
    setProducts(storage.getProducts());
    setAccounts(storage.getAccounts());
    setProductAccounts(storage.getProductAccounts());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Product Actions
  const addProduct = (name: string, description: string) => {
    const newProduct: Product = {
      id: generateId(),
      name,
      description,
      createdAt: Date.now(),
    };
    const updated = [...products, newProduct];
    storage.setProducts(updated);
    refreshData();
  };

  const updateProduct = (id: string, name: string, description: string) => {
    const updated = products.map(p => p.id === id ? { ...p, name, description } : p);
    storage.setProducts(updated);
    refreshData();
  };

  const deleteProduct = (id: string) => {
    // Delete product
    const updatedProducts = products.filter(p => p.id !== id);
    storage.setProducts(updatedProducts);

    // Delete relations
    const updatedPA = productAccounts.filter(pa => pa.productId !== id);
    storage.setProductAccounts(updatedPA);
    
    // Note: We don't strictly delete the Account entity itself as it might be used elsewhere,
    // or we could implement a cleanup for orphaned accounts if needed.
    refreshData();
  };

  // Account Actions
  const linkAccountToProduct = (productId: string, email: string) => {
    let allAccounts = storage.getAccounts();
    let targetAccount = allAccounts.find(a => a.email === email);

    // Create Account if not exists
    if (!targetAccount) {
      targetAccount = {
        id: generateId(),
        email,
        status: 'active', // Default state is now 'active' (Ready)
        countdownStartAt: null,
        countdownEndAt: null,
        createdAt: Date.now(),
      };
      allAccounts.push(targetAccount);
      storage.setAccounts(allAccounts);
    }

    // Create Link if not exists
    const allLinks = storage.getProductAccounts();
    const exists = allLinks.find(link => link.productId === productId && link.accountId === targetAccount?.id);
    
    if (!exists && targetAccount) {
      const newLink: ProductAccount = {
        id: generateId(),
        productId,
        accountId: targetAccount.id,
      };
      storage.setProductAccounts([...allLinks, newLink]);
    }
    
    refreshData();
  };

  const unlinkAccount = (relationId: string) => {
    const updated = productAccounts.filter(pa => pa.id !== relationId);
    storage.setProductAccounts(updated);
    refreshData();
  };

  // Countdown Logic
  const startCountdown = (accountId: string, days: number) => {
    const now = Date.now();
    const end = now + (days * 24 * 60 * 60 * 1000);

    const updatedAccounts = accounts.map(a => {
      if (a.id === accountId) {
        return {
          ...a,
          status: 'cooldown' as const, // Starting countdown sets status to 'cooldown'
          countdownStartAt: now,
          countdownEndAt: end,
        };
      }
      return a;
    });

    storage.setAccounts(updatedAccounts);
    refreshData();
  };

  const resetCountdown = (accountId: string) => {
    const updatedAccounts = accounts.map(a => {
      if (a.id === accountId) {
        return {
          ...a,
          status: 'active' as const, // Resetting sets status to 'active' (Ready)
          countdownStartAt: null,
          countdownEndAt: null,
        };
      }
      return a;
    });

    storage.setAccounts(updatedAccounts);
    refreshData();
  };

  return (
    <StoreContext.Provider value={{
      products,
      accounts,
      productAccounts,
      addProduct,
      updateProduct,
      deleteProduct,
      linkAccountToProduct,
      unlinkAccount,
      startCountdown,
      resetCountdown,
      refreshData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};