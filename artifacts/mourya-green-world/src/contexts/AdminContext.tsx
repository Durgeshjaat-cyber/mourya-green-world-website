import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, products as defaultProducts, categories as defaultCategories } from '@/data/products';

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
}

export interface AdminSettings {
  whatsappPrimary: string;
  whatsappSecondary: string;
  email: string;
  address: string;
  adminUsername: string;
  adminPasswordHash: string;
  storeName: string;
  googleAnalyticsId: string;
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
  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id'>) => void;
  updateReview: (id: string, changes: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  // Settings
  settings: AdminSettings;
  updateSettings: (changes: Partial<AdminSettings>) => void;
}

const STORAGE_KEYS = {
  products: 'mourya_admin_products',
  categories: 'mourya_admin_categories',
  settings: 'mourya_admin_settings',
  reviews: 'mourya_admin_reviews',
  session: 'mourya_admin_session',
};

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
  email: 'mouryagreenworld@gmail.com',
  address: 'Mourya Nursery, Sector 94, Bandh Road, Near Okhla Bird Sanctuary, Noida, Uttar Pradesh 201301',
  adminUsername: 'mouryaadmin',
  adminPasswordHash: simpleHash('Mourya@2026'),
  storeName: 'Mourya Green World',
  googleAnalyticsId: '',
};

const DEFAULT_REVIEWS: Review[] = [
  { id: 'rv1', name: 'Priya Sharma', rating: 5, text: 'Got my Monstera from here and it is absolutely thriving. Great quality and excellent packaging.', location: 'Noida Sector 18', date: 'Dec 2024' },
  { id: 'rv2', name: 'Rahul Verma', rating: 5, text: 'Best nursery in Noida! The plants are healthy and the WhatsApp support is incredibly helpful.', location: 'Greater Noida', date: 'Nov 2024' },
  { id: 'rv3', name: 'Anjali Singh', rating: 5, text: 'Ordered 5 plants and all arrived in perfect condition. Will definitely order again from Mourya Green World!', location: 'Noida Sector 62', date: 'Oct 2024' },
  { id: 'rv4', name: 'Deepak Gupta', rating: 4, text: 'My snake plant and aloe vera are doing amazing. The care guide that came with the order was super helpful.', location: 'Noida Extension', date: 'Sep 2024' },
];

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
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    sessionStorage.getItem(STORAGE_KEYS.session) === 'true'
  );

  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage(STORAGE_KEYS.products, defaultProducts)
  );

  const [categories, setCategories] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.categories, defaultCategories)
  );

  const [settings, setSettings] = useState<AdminSettings>(() => {
    const stored = loadFromStorage<Partial<AdminSettings>>(STORAGE_KEYS.settings, {});
    return { ...DEFAULT_SETTINGS, ...stored };
  });

  const [reviews, setReviews] = useState<Review[]>(() =>
    loadFromStorage(STORAGE_KEYS.reviews, DEFAULT_REVIEWS)
  );

  // Persist on change
  useEffect(() => { saveToStorage(STORAGE_KEYS.products, products); }, [products]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.categories, categories); }, [categories]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.settings, settings); }, [settings]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.reviews, reviews); }, [reviews]);

  // Inject Google Analytics when GA ID is set
  useEffect(() => {
    const gaId = settings.googleAnalyticsId?.trim();
    if (!gaId) return;
    if (document.getElementById('ga-script')) return; // already injected

    const script1 = document.createElement('script');
    script1.id = 'ga-script';
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.id = 'ga-init';
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(script2);
  }, [settings.googleAnalyticsId]);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === settings.adminUsername && simpleHash(password) === settings.adminPasswordHash) {
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

  const addReview = useCallback((data: Omit<Review, 'id'>) => {
    const id = `rv${Date.now()}`;
    setReviews(prev => [...prev, { ...data, id }]);
  }, []);

  const updateReview = useCallback((id: string, changes: Partial<Review>) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...changes } : r));
  }, []);

  const deleteReview = useCallback((id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  }, []);

  const updateSettings = useCallback((changes: Partial<AdminSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...changes };
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
      reviews, addReview, updateReview, deleteReview,
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

export function usePublicData() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('usePublicData must be used within AdminProvider');
  return {
    products: ctx.products,
    categories: ctx.categories,
    settings: ctx.settings,
    reviews: ctx.reviews,
  };
}
