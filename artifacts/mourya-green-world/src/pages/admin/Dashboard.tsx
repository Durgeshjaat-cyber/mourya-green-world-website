import { useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Package, Tag, TrendingUp, AlertCircle, Plus, Settings, ArrowRight, Star } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

export default function AdminDashboard() {
  const { products, categories, settings } = useAdmin();

  useEffect(() => { document.title = 'Dashboard — Admin'; }, []);

  const inStock = products.filter(p => p.inStock).length;
  const outOfStock = products.filter(p => !p.inStock).length;
  const bestsellers = products.filter(p => p.isBestseller).length;
  const newArrivals = products.filter(p => p.isNew).length;

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-50 text-blue-600', change: `${inStock} in stock` },
    { label: 'Categories', value: categories.length, icon: Tag, color: 'bg-violet-50 text-violet-600', change: 'Active' },
    { label: 'Bestsellers', value: bestsellers, icon: Star, color: 'bg-amber-50 text-amber-600', change: 'Marked' },
    { label: 'Out of Stock', value: outOfStock, icon: AlertCircle, color: outOfStock > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600', change: outOfStock > 0 ? 'Needs attention' : 'All good!' },
  ];

  const quickActions = [
    { label: 'Add New Plant', desc: 'Add a product to your catalog', href: '/admin/products/new', icon: Plus, color: 'bg-primary text-white' },
    { label: 'Manage Products', desc: 'Edit prices, stock, details', href: '/admin/products', icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Categories', desc: 'Add or remove categories', href: '/admin/categories', icon: Tag, color: 'bg-violet-50 text-violet-600' },
    { label: 'Settings', desc: 'WhatsApp, password & more', href: '/admin/settings', icon: Settings, color: 'bg-gray-100 text-gray-600' },
  ];

  const recentProducts = [...products].reverse().slice(0, 5);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6 max-w-5xl">
      {/* Welcome */}
      <motion.div variants={fadeUp}>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back 👋</h2>
        <p className="text-gray-500 text-sm mt-1">
          {settings.storeName} — Admin Dashboard
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(action => (
            <Link key={action.label} href={action.href}>
              <a className="group bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all block">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors">{action.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{action.desc}</p>
              </a>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Products */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Recent Products</h3>
          <Link href="/admin/products">
            <a className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </a>
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {recentProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No products yet</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Product</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">Category</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500">Price</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p, i) => (
                  <tr key={p.id} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors`}>
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-sm text-gray-900 line-clamp-1">{p.name}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-gray-500">{p.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm font-semibold text-primary">₹{p.price}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* WhatsApp Info */}
      <motion.div variants={fadeUp} className="bg-green-50 border border-green-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 flex items-center justify-center shrink-0">
          <span className="text-xl">📱</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">WhatsApp Order Number</p>
          <p className="text-xs text-gray-500 mt-0.5">Primary: +{settings.whatsappPrimary} · Secondary: +{settings.whatsappSecondary}</p>
        </div>
        <Link href="/admin/settings">
          <a>
            <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-100 whitespace-nowrap">
              Update Numbers
            </Button>
          </a>
        </Link>
      </motion.div>
    </motion.div>
  );
}
