import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Star, Check, X, AlertTriangle } from 'lucide-react';
import { useAdmin, Review } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const EMPTY_FORM = { name: '', location: '', rating: 5, text: '', date: '' };

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="p-0.5"
        >
          <Star className={`h-5 w-5 transition-colors ${(hover || value) >= n ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
        </button>
      ))}
      <span className="text-sm text-gray-500 ml-1 self-center">{value}/5</span>
    </div>
  );
}

export default function AdminReviews() {
  const { reviews, addReview, updateReview, deleteReview } = useAdmin();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { document.title = 'Reviews — Admin'; }, []);

  const resetForm = () => { setForm(EMPTY_FORM); setErrors({}); setEditingId(null); setShowForm(false); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.text.trim() || form.text.length < 10) e.text = 'Review must be at least 10 characters';
    if (!form.date.trim()) e.date = 'Date is required (e.g. Jan 2025)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editingId) {
      updateReview(editingId, form);
      toast({ title: 'Review updated!' });
    } else {
      addReview(form);
      toast({ title: 'Review added!', description: 'It will now appear on the website.' });
    }
    resetForm();
  };

  const startEdit = (r: Review) => {
    setForm({ name: r.name, location: r.location, rating: r.rating, text: r.text, date: r.date });
    setEditingId(r.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
          <p className="text-sm text-gray-500">{reviews.length} reviews · Displayed on the homepage</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(v => !v); }}
          className="bg-primary hover:bg-primary/90 text-white gap-2"
        >
          <Plus className="h-4 w-4" /> Add Review
        </Button>
      </div>

      {/* Add/Edit form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">{editingId ? 'Edit Review' : 'Add New Review'}</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Customer Name *</label>
                  <Input
                    placeholder="e.g. Priya Sharma"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Location *</label>
                  <Input
                    placeholder="e.g. Noida Sector 18"
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  />
                  {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Rating *</label>
                  <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Date *</label>
                  <Input
                    placeholder="e.g. Jan 2025"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  />
                  {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Review Text *</label>
                <Textarea
                  placeholder="What did the customer say about Mourya Green World?"
                  rows={3}
                  value={form.text}
                  onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                />
                {errors.text && <p className="text-xs text-red-500">{errors.text}</p>}
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-white gap-2">
                  <Check className="h-4 w-4" />
                  {editingId ? 'Save Changes' : 'Add Review'}
                </Button>
                <Button variant="outline" onClick={resetForm} className="gap-2">
                  <X className="h-4 w-4" /> Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews list */}
      <div className="space-y-3">
        <AnimatePresence>
          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
              <p className="text-4xl mb-3">⭐</p>
              <p className="text-gray-500 font-medium">No reviews yet</p>
              <p className="text-gray-400 text-sm">Add your first customer review above</p>
            </div>
          ) : (
            reviews.map(review => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                    {review.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                        <p className="text-xs text-gray-400">{review.location} · {review.date}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(review)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-primary hover:bg-primary/10"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Delete review by {review.name}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>This will remove the review from your website.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => { deleteReview(review.id); toast({ title: 'Review deleted' }); }}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 my-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">"{review.text}"</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      <p className="text-xs text-gray-400 text-center">Reviews are saved instantly and shown on the homepage</p>
    </div>
  );
}
