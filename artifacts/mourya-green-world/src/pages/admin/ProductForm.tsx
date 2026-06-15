import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload, Link as LinkIcon, CheckCircle, Plus, X, Images } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  price: z.coerce.number().min(1, 'Price must be at least ₹1'),
  originalPrice: z.coerce.number().min(1, 'Original price must be at least ₹1'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  reviews: z.coerce.number().min(0),
  inStock: z.boolean(),
  isBestseller: z.boolean(),
  isNew: z.boolean(),
  sunlight: z.string().min(1, 'Sunlight info required'),
  water: z.string().min(1, 'Watering info required'),
  growth: z.string().min(1, 'Growth info required'),
  benefits: z.string().min(1, 'At least one benefit required'),
});

type ProductFormData = z.infer<typeof productSchema>;

const PLANT_EMOJIS: Record<string, string> = {
  'Indoor Plants': '🌿', 'Outdoor Plants': '🌱', 'Air Purifying Plants': '💨',
  'Lucky Plants': '🍀', 'Flowering Plants': '🌸', 'Succulents': '🌵',
  'Hanging Plants': '🪴', 'Bonsai Plants': '🌳', 'Pots & Planters': '🏺',
};

export default function ProductForm() {
  const params = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const { products, categories, addProduct, updateProduct } = useAdmin();
  const { toast } = useToast();
  const [imgPreview, setImgPreview] = useState('');
  const [imgError, setImgError] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  const isEdit = !!params.id;
  const existing = isEdit ? products.find(p => p.id === params.id) : undefined;
  const [extraImages, setExtraImages] = useState<string[]>(() => existing?.images ?? ['']);

  useEffect(() => {
    document.title = isEdit ? `Edit ${existing?.name ?? 'Product'} — Admin` : 'Add Product — Admin';
    if (!isEdit && !existing && params.id) setLocation('/admin/products');
  }, []);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: existing ? {
      name: existing.name,
      price: existing.price,
      originalPrice: existing.originalPrice,
      category: existing.category,
      description: existing.description,
      image: existing.image || '',
      rating: existing.rating,
      reviews: existing.reviews,
      inStock: existing.inStock,
      isBestseller: existing.isBestseller,
      isNew: existing.isNew,
      sunlight: existing.careTips.sunlight,
      water: existing.careTips.water,
      growth: existing.careTips.growth,
      benefits: existing.careTips.benefits.join(', '),
    } : {
      name: '', price: 199, originalPrice: 299, category: '', description: '',
      image: '', rating: 4.5, reviews: 0, inStock: true,
      isBestseller: false, isNew: true,
      sunlight: '', water: '', growth: '', benefits: '',
    },
  });

  const watchedImage = form.watch('image');
  useEffect(() => {
    setImgError(false);
    setImgPreview(watchedImage || '');
  }, [watchedImage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500_000) {
      toast({ title: 'Image too large', description: 'Please use an image under 500KB or paste an image URL.', variant: 'destructive' });
      return;
    }
    setFileLoading(true);
    const reader = new FileReader();
    reader.onload = ev => {
      const b64 = ev.target?.result as string;
      form.setValue('image', b64);
      setFileLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: ProductFormData) => {
    const productData = {
      name: data.name,
      price: data.price,
      originalPrice: data.originalPrice,
      category: data.category,
      description: data.description,
      image: data.image || '',
      images: extraImages.filter(u => u.trim()),
      rating: data.rating,
      reviews: data.reviews,
      inStock: data.inStock,
      isBestseller: data.isBestseller,
      isNew: data.isNew,
      careTips: {
        sunlight: data.sunlight,
        water: data.water,
        growth: data.growth,
        benefits: data.benefits.split(',').map(b => b.trim()).filter(Boolean),
      },
    };

    if (isEdit && existing) {
      updateProduct(existing.id, productData);
      toast({ title: 'Product updated!', description: `${data.name} has been updated.` });
    } else {
      addProduct(productData);
      toast({ title: 'Product added!', description: `${data.name} is now live in your store.` });
    }
    setLocation('/admin/products');
  };

  const watchedCategory = form.watch('category');

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => setLocation('/admin/products')} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Plant'}</h2>
          <p className="text-sm text-gray-500">{isEdit ? `Editing: ${existing?.name}` : 'Fill in the details to add to your catalog'}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Basic Information</h3>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Plant Name *</FormLabel>
                <FormControl><Input data-testid="input-product-name" placeholder="e.g. Monstera Deliciosa" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-product-category">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl><Textarea data-testid="input-product-desc" placeholder="Describe the plant, its features, and why customers will love it..." rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* Image */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Plant Photo</h3>
            <div className="grid sm:grid-cols-2 gap-4 items-start">
              <div className="space-y-3">
                <FormField control={form.control} name="image" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5"><LinkIcon className="h-3.5 w-3.5" /> Image URL</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-product-image"
                        placeholder="https://example.com/plant.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="relative">
                  <label className="flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-3 hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <Upload className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {fileLoading ? 'Uploading...' : 'Or upload from device (max 500KB)'}
                    </span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
              {/* Preview */}
              <div className="aspect-square rounded-xl overflow-hidden bg-green-50 flex items-center justify-center border border-gray-100">
                {imgPreview && !imgError ? (
                  <img
                    src={imgPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                    onLoad={() => setImgError(false)}
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-6xl block mb-2">{PLANT_EMOJIS[watchedCategory] || '🌿'}</span>
                    <p className="text-xs text-gray-400">{imgError ? 'Image failed to load' : 'Preview appears here'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Images */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide flex items-center gap-2">
                  <Images className="h-4 w-4" /> Additional Photos
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Add more image URLs for the product gallery (customers can browse all photos)</p>
              </div>
              <button
                type="button"
                onClick={() => setExtraImages(p => [...p, ''])}
                className="flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Photo
              </button>
            </div>
            {extraImages.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4 border-2 border-dashed border-gray-100 rounded-xl">
                No additional photos. Click "Add Photo" to add more images.
              </p>
            )}
            <div className="space-y-2">
              {extraImages.map((url, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400 w-5 shrink-0 text-center">{idx + 1}</span>
                  <Input
                    placeholder={`https://example.com/photo-${idx + 1}.jpg`}
                    value={url}
                    onChange={e => setExtraImages(p => p.map((u, i) => i === idx ? e.target.value : u))}
                    className="flex-1 text-sm"
                  />
                  {url && (
                    <img
                      src={url}
                      alt="thumb"
                      className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setExtraImages(p => p.filter((_, i) => i !== idx))}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Price (₹) *</FormLabel>
                  <FormControl><Input data-testid="input-product-price" type="number" min={1} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="originalPrice" render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Price (₹) *</FormLabel>
                  <FormControl><Input data-testid="input-product-original-price" type="number" min={1} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="rating" render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (1–5)</FormLabel>
                  <FormControl><Input type="number" min={1} max={5} step={0.1} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="reviews" render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Count</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          {/* Status & Badges */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Status & Badges</h3>
            <div className="space-y-4">
              {([
                { name: 'inStock', label: 'In Stock', desc: 'Product is available for purchase' },
                { name: 'isBestseller', label: 'Bestseller', desc: 'Show bestseller badge on product card' },
                { name: 'isNew', label: 'New Arrival', desc: 'Show "New" badge on product card' },
              ] as const).map(toggle => (
                <FormField key={toggle.name} control={form.control} name={toggle.name} render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-900 cursor-pointer">{toggle.label}</FormLabel>
                      <p className="text-xs text-gray-400 mt-0.5">{toggle.desc}</p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid={`switch-${toggle.name}`}
                      />
                    </FormControl>
                  </FormItem>
                )} />
              ))}
            </div>
          </div>

          {/* Care Tips */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Plant Care Guide</h3>
            {([
              { name: 'sunlight', label: '☀️ Sunlight', placeholder: 'e.g. Bright indirect light to low light' },
              { name: 'water', label: '💧 Watering', placeholder: 'e.g. Water when top inch of soil is dry' },
              { name: 'growth', label: '🌱 Growth', placeholder: 'e.g. Fast growing trailing vine' },
              { name: 'benefits', label: '✅ Benefits', placeholder: 'Comma-separated: Air purifying, Easy to grow, Brings positive energy' },
            ] as const).map(field => (
              <FormField key={field.name} control={form.control} name={field.name} render={({ field: f }) => (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl><Input placeholder={field.placeholder} {...f} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            ))}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pb-8">
            <Button
              data-testid="button-save-product"
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 text-base"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isEdit ? 'Save Changes' : 'Add Plant to Store'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setLocation('/admin/products')} className="px-6 h-12">
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
