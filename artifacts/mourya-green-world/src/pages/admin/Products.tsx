import { useState, useMemo, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight, Star, Sparkles, Filter, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';

export default function AdminProducts() {
  const { products, deleteProduct, toggleStock, categories } = useAdmin();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'outofstock'>('all');

  useEffect(() => { document.title = 'Products — Admin'; }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'All') list = list.filter(p => p.category === categoryFilter);
    if (stockFilter === 'instock') list = list.filter(p => p.inStock);
    if (stockFilter === 'outofstock') list = list.filter(p => !p.inStock);
    return list;
  }, [products, search, categoryFilter, stockFilter]);

  const outCount = products.filter(p => !p.inStock).length;

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">{products.length} total · {outCount > 0 && <span className="text-red-500">{outCount} out of stock</span>}</p>
        </div>
        <Link href="/admin/products/new">
          <a>
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
              <Plus className="h-4 w-4" /> Add New Plant
            </Button>
          </a>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            data-testid="input-product-search"
            placeholder="Search plants..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={stockFilter}
          onChange={e => setStockFilter(e.target.value as any)}
          className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Stock</option>
          <option value="instock">In Stock</option>
          <option value="outofstock">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">🌿</p>
            <p className="text-gray-500 font-medium">No products found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Product</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Category</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500">Price</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500">Badges</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500">Stock</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <motion.tr
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    data-testid={`row-product-${product.id}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                          {product.image && !product.image.includes('/images/') ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : '🌿'}
                        </div>
                        <span className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{product.category}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div>
                        <span className="font-bold text-sm text-primary">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through ml-1">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {product.isBestseller && (
                          <span title="Bestseller" className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                            <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                          </span>
                        )}
                        {product.isNew && (
                          <span title="New Arrival" className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <Sparkles className="h-2.5 w-2.5 text-blue-500" />
                          </span>
                        )}
                        {!product.isBestseller && !product.isNew && <span className="text-gray-200 text-xs">—</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        data-testid={`button-toggle-stock-${product.id}`}
                        onClick={() => toggleStock(product.id)}
                        title="Toggle stock status"
                        className="flex items-center justify-center mx-auto"
                      >
                        {product.inStock ? (
                          <ToggleRight className="h-7 w-7 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-7 w-7 text-gray-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <a>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-primary hover:bg-primary/10">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              data-testid={`button-delete-${product.id}`}
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Delete "{product.name}"?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove this product from your store. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteProduct(product.id)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Delete Product
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 text-center">
        Showing {filtered.length} of {products.length} products · Changes are saved instantly and reflected on the website
      </p>
    </div>
  );
}
