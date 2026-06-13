import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, products as defaultProducts, categories as defaultCategories } from '@/data/products';

export interface AdminSettings {
  whatsappPrimary: string;
  whatsappSecondary: string;
  adminUsername: string;
  adminPasswordHash: string;
  storeName: string;
}

interface AdminContextType {
  // Auth
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, changes: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;
  // Categories
  categories: string[];
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
  renameCategory: (oldName: string, newName: string) => void;
  // Settings
  settings: AdminSettings;
  updateSettings: (changes: Partial<AdminSettings>) => void;
}

const STORAGE_KEYS = {
  products: 'mourya_admin_products',
  categories: 'mourya_admin_categories',
  settings: 'mourya_admin_settings',
  session: 'mourya_admin_session',
};

// Simple hash for password storage
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

const DEFAULT_SETTINGS: AdminSettings = {
  whatsappPrimary: '919871217876',
  whatsappSecondary: '919958032648',
  adminUsername: 'mouryaadmin',
  adminPasswordHash: simpleHash('Mourya@2026'),
  storeName: 'Mourya Green World',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage save failed:', e);
  }
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEYS.session) === 'true';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    return loadFromStorage(STORAGE_KEYS.products, defaultProducts);
  });

  const [categories, setCategories] = useState<string[]>(() => {
    return loadFromStorage(STORAGE_KEYS.categories, defaultCategories);
  });

  const [settings, setSettings] = useState<AdminSettings>(() => {
    const stored = loadFromStorage<Partial<AdminSettings>>(STORAGE_KEYS.settings, {});
    return { ...DEFAULT_SETTINGS, ...stored };
  });

  // Persist on change
  useEffect(() => { saveToStorage(STORAGE_KEYS.products, products); }, [products]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.categories, categories); }, [categories]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.settings, settings); }, [settings]);

  const login = useCallback((username: string, password: string): boolean => {
    if (
      username === settings.adminUsername &&
      simpleHash(password) === settings.adminPasswordHash
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.session, 'true');
      return true;
    }
    return false;
  }, [settings.adminUsername, settings.adminPasswordHash]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.session);
  }, []);

  const addProduct = useCallback((data: Omit<Product, 'id'>): Product => {
    const id = `p${Date.now()}`;
    const newProduct: Product = { ...data, id };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, changes: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const toggleStock = useCallback((id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p));
  }, []);

  const addCategory = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories(prev => [...prev, trimmed]);
    }
  }, [categories]);

  const removeCategory = useCallback((name: string) => {
    setCategories(prev => prev.filter(c => c !== name));
  }, []);

  const renameCategory = useCallback((oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories(prev => prev.map(c => c === oldName ? trimmed : c));
    setProducts(prev => prev.map(p => p.category === oldName ? { ...p, category: trimmed } : p));
  }, [categories]);

  const updateSettings = useCallback((changes: Partial<AdminSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...changes };
      // If password change comes in plain text, hash it
      if (changes.adminPasswordHash && changes.adminPasswordHash.length < 20) {
        next.adminPasswordHash = simpleHash(changes.adminPasswordHash);
      }
      return next;
    });
  }, []);

  return (
    <AdminContext.Provider value={{
      isAuthenticated, login, logout,
      products, addProduct, updateProduct, deleteProduct, toggleStock,
      categories, addCategory, removeCategory, renameCategory,
      settings, updateSettings,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

// Lightweight hook for public pages — no auth required
export function usePublicData() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('usePublicData must be used within AdminProvider');
  return {
    products: ctx.products,
    categories: ctx.categories,
    settings: ctx.settings,
  };
}
