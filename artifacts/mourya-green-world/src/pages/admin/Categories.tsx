import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Pencil, Check, X, AlertTriangle, Tag } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const CATEGORY_EMOJIS: Record<string, string> = {
  'Indoor Plants': '🌿', 'Outdoor Plants': '🌱', 'Air Purifying Plants': '💨',
  'Lucky Plants': '🍀', 'Flowering Plants': '🌸', 'Succulents': '🌵',
  'Hanging Plants': '🪴', 'Bonsai Plants': '🌳', 'Pots & Planters': '🏺',
};

export default function AdminCategories() {
  const { categories, products, addCategory, removeCategory, renameCategory } = useAdmin();
  const { toast } = useToast();
  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => { document.title = 'Categories — Admin'; }, []);

  const productCountFor = (cat: string) => products.filter(p => p.category === cat).length;

  const handleAdd = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      toast({ title: 'Category exists', description: `"${trimmed}" already exists.`, variant: 'destructive' });
      return;
    }
    addCategory(trimmed);
    toast({ title: 'Category added!', description: `"${trimmed}" has been added.` });
    setNewCatName('');
  };

  const startEdit = (cat: string) => {
    setEditingCat(cat);
    setEditValue(cat);
  };

  const commitEdit = () => {
    if (!editingCat || !editValue.trim()) { setEditingCat(null); return; }
    if (editValue.trim() === editingCat) { setEditingCat(null); return; }
    if (categories.includes(editValue.trim())) {
      toast({ title: 'Name taken', description: 'That category name already exists.', variant: 'destructive' });
      return;
    }
    renameCategory(editingCat, editValue.trim());
    toast({ title: 'Category renamed!', description: `"${editingCat}" → "${editValue.trim()}"` });
    setEditingCat(null);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Categories</h2>
        <p className="text-sm text-gray-500">{categories.length} categories · Renaming updates all products in that category</p>
      </div>

      {/* Add new */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Add New Category</h3>
        <div className="flex gap-2">
          <Input
            data-testid="input-new-category"
            placeholder="e.g. Medicinal Plants"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="flex-1"
          />
          <Button
            data-testid="button-add-category"
            onClick={handleAdd}
            className="bg-primary hover:bg-primary/90 text-white gap-2"
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      {/* Category list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Existing Categories</span>
        </div>
        <AnimatePresence>
          {categories.map((cat, i) => (
            <motion.div
              key={cat}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-gray-50 last:border-0"
              data-testid={`row-category-${cat}`}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-xl shrink-0">
                  {CATEGORY_EMOJIS[cat] || <Tag className="h-4 w-4 text-primary" />}
                </div>

                {editingCat === cat ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      autoFocus
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingCat(null); }}
                      className="h-8 text-sm"
                    />
                    <button onClick={commitEdit} className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </button>
                    <button onClick={() => setEditingCat(null)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <X className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">{cat}</p>
                    <p className="text-xs text-gray-400">{productCountFor(cat)} product{productCountFor(cat) !== 1 ? 's' : ''}</p>
                  </div>
                )}

                {editingCat !== cat && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(cat)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-primary hover:bg-primary/10"
                      data-testid={`button-edit-category-${cat}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                          data-testid={`button-delete-category-${cat}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Delete "{cat}"?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This removes the category. The {productCountFor(cat)} product{productCountFor(cat) !== 1 ? 's' : ''} in this category will still exist but will no longer have a valid category assigned.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => { removeCategory(cat); toast({ title: `"${cat}" deleted` }); }}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Delete Category
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
