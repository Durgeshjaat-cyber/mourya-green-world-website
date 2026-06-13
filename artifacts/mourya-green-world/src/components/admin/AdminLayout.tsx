import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Tag, Settings, LogOut,
  Menu, X, ChevronRight, Store
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/categories', label: 'Categories', icon: Tag },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, settings } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string, exact?: boolean) =>
    exact ? location === path : location.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Admin Panel</p>
              <p className="text-xs text-muted-foreground">{settings.storeName}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.path} href={item.path}>
              <a
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.path, item.exact)
                    ? 'bg-primary text-white shadow-sm shadow-primary/25'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
                {isActive(item.path, item.exact) && (
                  <ChevronRight className="h-3.5 w-3.5 ml-auto" />
                )}
              </a>
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link href="/">
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all">
              <Store className="h-4 w-4" />
              View Website
            </a>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 lg:px-6 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-gray-900 hidden sm:block">
              {navItems.find(n => isActive(n.path, n.exact))?.label ?? 'Admin'}
            </h1>
          </div>
          <span className="text-xs text-muted-foreground bg-green-50 text-green-700 font-medium px-3 py-1 rounded-full">
            🟢 Admin
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
