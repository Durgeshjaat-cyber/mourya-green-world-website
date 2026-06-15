import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaWhatsapp } from 'react-icons/fa';
import {
  Eye, EyeOff, Shield, Phone, Store, RefreshCw, AlertTriangle,
  Download, BarChart3, Mail, MapPin, FileJson, FileText
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';

const contactSchema = z.object({
  storeName: z.string().min(2, 'Store name required'),
  email: z.string().email('Enter a valid email'),
  address: z.string().min(10, 'Address required'),
  whatsappPrimary: z.string().min(10).max(15).regex(/^\d+$/, 'Numbers only, no +, spaces or dashes'),
  whatsappSecondary: z.string().min(10).max(15).regex(/^\d+$/, 'Numbers only'),
  googleAnalyticsId: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newUsername: z.string().min(4, 'Username must be at least 4 characters'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export default function AdminSettings() {
  const { settings, updateSettings, products, categories, reviews } = useAdmin();
  const { toast } = useToast();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => { document.title = 'Settings — Admin'; }, []);

  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      storeName: settings.storeName,
      email: settings.email,
      address: settings.address,
      whatsappPrimary: settings.whatsappPrimary,
      whatsappSecondary: settings.whatsappSecondary,
      googleAnalyticsId: settings.googleAnalyticsId || '',
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newUsername: settings.adminUsername, newPassword: '', confirmPassword: '' },
  });

  const onContactSubmit = (data: z.infer<typeof contactSchema>) => {
    updateSettings({
      storeName: data.storeName,
      email: data.email,
      address: data.address,
      whatsappPrimary: data.whatsappPrimary,
      whatsappSecondary: data.whatsappSecondary,
      googleAnalyticsId: data.googleAnalyticsId || '',
    });
    toast({ title: 'Business info updated!', description: 'All changes are live on the website.' });
  };

  const onPasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
    if (simpleHash(data.currentPassword) !== settings.adminPasswordHash) {
      passwordForm.setError('currentPassword', { message: 'Incorrect current password' });
      return;
    }
    updateSettings({ adminUsername: data.newUsername, adminPasswordHash: simpleHash(data.newPassword) });
    toast({ title: 'Credentials updated!', description: 'Use your new credentials next time you log in.' });
    passwordForm.reset({ currentPassword: '', newUsername: data.newUsername, newPassword: '', confirmPassword: '' });
  };

  // Export as JSON
  const exportJSON = () => {
    const data = { products, categories, reviews, settings: { ...settings, adminPasswordHash: '[HIDDEN]', adminUsername: '[HIDDEN]' } };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mourya-green-world-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'JSON backup downloaded!' });
  };

  // Export products as CSV
  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Price', 'Original Price', 'In Stock', 'Rating', 'Reviews', 'Bestseller', 'New', 'Description'];
    const rows = products.map(p => [
      p.id, `"${p.name}"`, `"${p.category}"`, p.price, p.originalPrice,
      p.inStock ? 'Yes' : 'No', p.rating, p.reviews,
      p.isBestseller ? 'Yes' : 'No', p.isNew ? 'Yes' : 'No',
      `"${p.description.replace(/"/g, '""')}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mourya-products-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'CSV exported!', description: `${products.length} products exported.` });
  };

  const handleResetData = () => {
    localStorage.removeItem('mourya_admin_products');
    localStorage.removeItem('mourya_admin_categories');
    localStorage.removeItem('mourya_admin_reviews');
    toast({ title: 'Data reset', description: 'Reloading page...' });
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Manage business info, WhatsApp numbers, analytics and admin credentials</p>
      </div>

      {/* Business Info */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Business Information</h3>
            <p className="text-xs text-gray-400">Contact info, address, and WhatsApp numbers shown on your website</p>
          </div>
        </div>

        <Form {...contactForm}>
          <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
            <FormField control={contactForm.control} name="storeName" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5"><Store className="h-3.5 w-3.5" /> Store Name</FormLabel>
                <FormControl><Input placeholder="Mourya Green World" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={contactForm.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email Address</FormLabel>
                <FormControl><Input type="email" placeholder="mouryagreenworld@gmail.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={contactForm.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Nursery Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Mourya Nursery, Sector 94, Bandh Road..." rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">WhatsApp Numbers</p>
              <div className="space-y-3">
                <FormField control={contactForm.control} name="whatsappPrimary" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5"><FaWhatsapp className="h-3.5 w-3.5 text-[#25D366]" /> Primary WhatsApp</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">+</span>
                        <Input data-testid="input-wa-primary" placeholder="919871217876" className="pl-7" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">Country code + number, no spaces or +. e.g. 919871217876</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={contactForm.control} name="whatsappSecondary" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Secondary Contact</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">+</span>
                        <Input data-testid="input-wa-secondary" placeholder="919958032648" className="pl-7" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="flex gap-2 mt-2">
                <a href={`https://wa.me/${contactForm.watch('whatsappPrimary')}?text=Test`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#25D366] border border-[#25D366]/30 px-3 py-1.5 rounded-lg hover:bg-[#25D366]/5 transition-colors">
                  <FaWhatsapp className="h-3.5 w-3.5" /> Test Primary
                </a>
                <a href={`https://wa.me/${contactForm.watch('whatsappSecondary')}?text=Test`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <Phone className="h-3.5 w-3.5" /> Test Secondary
                </a>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <FormField control={contactForm.control} name="googleAnalyticsId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Google Analytics ID</FormLabel>
                  <FormControl><Input placeholder="G-XXXXXXXXXX" {...field} /></FormControl>
                  <FormDescription className="text-xs">
                    Your GA4 Measurement ID. Get it from{' '}
                    <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">analytics.google.com</a>
                    {' '}→ Admin → Data Streams → Measurement ID (starts with G-)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              {settings.googleAnalyticsId && (
                <div className="mt-2 flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Google Analytics is active: {settings.googleAnalyticsId}
                </div>
              )}
            </div>

            <Button data-testid="button-save-contact" type="submit" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
              Save Business Info
            </Button>
          </form>
        </Form>
      </motion.div>

      {/* Admin Credentials */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Admin Credentials</h3>
            <p className="text-xs text-gray-400">Change your login username and password</p>
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl px-4 py-3 mb-4 text-xs text-blue-700">
          Current username: <strong>{settings.adminUsername}</strong>
        </div>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input data-testid="input-current-password" type={showCurrent ? 'text' : 'password'} placeholder="Enter current password" className="pr-10" {...field} />
                    <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-3">
              <FormField control={passwordForm.control} name="newUsername" render={({ field }) => (
                <FormItem>
                  <FormLabel>New Username *</FormLabel>
                  <FormControl><Input placeholder="e.g. mouryaadmin" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input data-testid="input-new-password" type={showNew ? 'text' : 'password'} placeholder="Min 8 characters" className="pr-10" {...field} />
                      <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password *</FormLabel>
                <FormControl><Input type="password" placeholder="Repeat new password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Update Credentials</Button>
          </form>
        </Form>
      </motion.div>

      {/* Backup & Export */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <Download className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Backup & Export</h3>
            <p className="text-xs text-gray-400">{products.length} products · {categories.length} categories · {reviews.length} reviews</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={exportJSON}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-violet-200 hover:border-violet-400 hover:bg-violet-50 transition-all group"
          >
            <FileJson className="h-7 w-7 text-violet-400 group-hover:text-violet-600 transition-colors" />
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">Full Backup</p>
              <p className="text-xs text-gray-400">Products + Reviews + Settings</p>
            </div>
          </button>
          <button
            onClick={exportCSV}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-green-200 hover:border-green-400 hover:bg-green-50 transition-all group"
          >
            <FileText className="h-7 w-7 text-green-400 group-hover:text-green-600 transition-colors" />
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">Products CSV</p>
              <p className="text-xs text-gray-400">Open in Excel / Sheets</p>
            </div>
          </button>
        </div>
        <p className="text-xs text-gray-400">Save the JSON backup regularly. You can use it to restore products if needed.</p>
      </motion.div>

      {/* Reset Data */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-1">Reset Store Data</h3>
        <p className="text-sm text-gray-500 mb-4">Resets all products, categories, and reviews to the original defaults. Admin credentials and business settings are not affected.</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 gap-2">
              <RefreshCw className="h-4 w-4" /> Reset to Default Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" /> Reset all product data?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all custom products, categories, and reviews and restore original defaults. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetData} className="bg-red-500 hover:bg-red-600 text-white">Reset Data</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </motion.div>
  );
}
