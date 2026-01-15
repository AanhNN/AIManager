import { Product, Account, ProductAccount } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'ai_manager_products',
  ACCOUNTS: 'ai_manager_accounts',
  PRODUCT_ACCOUNTS: 'ai_manager_product_accounts',
};

// Initial Data Seed
const seedData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    const products: Product[] = [
      { id: '1', name: 'ChatGPT Plus', description: 'OpenAI Advanced Model', createdAt: Date.now() },
      { id: '2', name: 'Claude Pro', description: 'Anthropic AI', createdAt: Date.now() },
      { id: '3', name: 'Midjourney', description: 'Image Generation', createdAt: Date.now() },
    ];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCT_ACCOUNTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCT_ACCOUNTS, JSON.stringify([]));
  }
};

seedData();

export const storage = {
  getProducts: (): Product[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]'),
  setProducts: (data: Product[]) => localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data)),

  getAccounts: (): Account[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || '[]'),
  setAccounts: (data: Account[]) => localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(data)),

  getProductAccounts: (): ProductAccount[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCT_ACCOUNTS) || '[]'),
  setProductAccounts: (data: ProductAccount[]) => localStorage.setItem(STORAGE_KEYS.PRODUCT_ACCOUNTS, JSON.stringify(data)),
};