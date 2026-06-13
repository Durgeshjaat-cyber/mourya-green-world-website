import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaWhatsapp } from 'react-icons/fa';
import { Eye, EyeOff, Shield, Phone, Store, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const contactSchema = z.object({
  whatsappPrimary: z.string().min(10, 'Enter a valid number (with country code, no + or spaces)').max(15).regex(/^\d+$/, 'Numbers only, no +, spaces or dashes'),
  whatsappSecondary: z.string().min(10, 'Enter a valid number').max(15).regex(/^\d+$/, 'Numbers only'),
  storeName: z.string().min(2, 'Store name required'),
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

export default function AdminSettings() {
  const { settings, updateSettings, products, categories } = useAdmin();
  const { toast } = useToast();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => { document.title = 'Settings — Admin'; }, []);

  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      whatsappPrimary: settings.whatsappPrimary,
      whatsappSecondary: settings.whatsappSecondary,
      storeName: settings.storeName,
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newUsername: settings.adminUsername, newPassword: '', confirmPassword: '' },
  });

  const onContactSubmit = (data: z.infer<typeof contactSchema>) => {
    updateSettings({ whatsappPrimary: data.whatsappPrimary, whatsappSecondary: data.whatsappSecondary, storeName: data.storeName });
    toast({ title: 'Contact info updated!', description: 'WhatsApp numbers and store name have been saved.' });
  };

  const onPasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
    if (simpleHash(data.currentPassword) !== settings.adminPasswordHash) {
      passwordForm.setError('currentPassword', { message: 'Incorrect current password' });
      return;
    }
    updateSettings({
      adminUsername: data.newUsername,
      adminPasswordHash: simpleHash(data.newPassword),
    });
    toast({ title: 'Credentials updated!', description: 'Your username and password have been changed. You will need the new credentials next time you log in.' });
    passwordForm.reset({ currentPassword: '', newUsername: data.newUsername, newPassword: '', confirmPassword: '' });
  };

  const handleResetData = () => {
    localStorage.removeItem('mourya_admin_products');
    localStorage.removeItem('mourya_admin_categories');
    toast({ title: 'Data reset', description: 'All product and category data has been reset to defaults. Reload the page to see changes.' });
    setTimeout(() => window.location.reload(), 1200);
  };

  const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
  const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Manage your store configuration and admin credentials</p>
      </div>

      {/* WhatsApp & Store */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
            <FaWhatsapp className="h-5 w-5 text-[#25D366]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">WhatsApp & Store Info</h3>
            <p className="text-xs text-gray-400">These numbers appear on all WhatsApp order buttons site-wide</p>
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
            <FormField control={contactForm.control} name="whatsappPrimary" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5"><FaWhatsapp className="h-3.5 w-3.5 text-[#25D366]" /> Primary WhatsApp Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">+</span>
                    <Input data-testid="input-wa-primary" placeholder="919871217876" className="pl-7" {...field} />
                  </div>
                </FormControl>
                <FormDescription className="text-xs">Include country code, no spaces or +. e.g. 919871217876</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={contactForm.control} name="whatsappSecondary" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Secondary Contact Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">+</span>
                    <Input data-testid="input-wa-secondary" placeholder="919958032648" className="pl-7" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* WhatsApp test links */}
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={`https://wa.me/${contactForm.watch('whatsappPrimary')}?text=Test%20from%20admin`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#25D366] border border-[#25D366]/30 px-3 py-1.5 rounded-lg hover:bg-[#25D366]/5 transition-colors"
              >
                <FaWhatsapp className="h-3.5 w-3.5" /> Test Primary
              </a>
              <a
                href={`https://wa.me/${contactForm.watch('whatsappSecondary')}?text=Test%20from%20admin`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" /> Test Secondary
              </a>
            </div>

            <Button data-testid="button-save-contact" type="submit" className="bg-primary hover:bg-primary/90 text-white">
              Save Contact Info
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

        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      data-testid="input-current-password"
                      type={showCurrent ? 'text' : 'password'}
                      placeholder="Enter current password"
                      className="pr-10"
                      {...field}
                    />
                    <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={passwordForm.control} name="newUsername" render={({ field }) => (
              <FormItem>
                <FormLabel>New Username *</FormLabel>
                <FormControl><Input data-testid="input-new-username" placeholder="e.g. mouryaadmin" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>New Password *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      data-testid="input-new-password"
                      type={showNew ? 'text' : 'password'}
                      placeholder="Min 8 characters"
                      className="pr-10"
                      {...field}
                    />
                    <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password *</FormLabel>
                <FormControl><Input type="password" placeholder="Repeat new password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button data-testid="button-save-credentials" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Update Credentials
            </Button>
          </form>
        </Form>
      </motion.div>

      {/* Data Info */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-1">Store Data</h3>
        <p className="text-sm text-gray-500 mb-4">
          {products.length} products · {categories.length} categories stored in browser localStorage
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 gap-2">
              <RefreshCw className="h-4 w-4" /> Reset to Default Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Reset all product data?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all your custom products and categories and restore the original default data. Admin credentials and WhatsApp numbers will not be affected. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetData} className="bg-red-500 hover:bg-red-600 text-white">
                Reset Data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </motion.div>
  );
}
