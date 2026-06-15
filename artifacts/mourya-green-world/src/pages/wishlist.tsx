import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = `Wishlist (${items.length}) — Mourya Green World`;
  }, [items.length]);

  const handleAddAllToCart = () => {
    items.forEach(item => addToCart(item));
    toast({ title: 'All items added to cart!', description: `${items.length} plants moved to your cart.` });
  };

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setLocation('/shop')} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Shop
          </button>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Wishlist {items.length > 0 && <span className="text-primary">({items.length})</span>}
          </h1>
          {items.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAllToCart}
                className="border-primary text-primary"
                data-testid="button-add-all-to-cart"
              >
                Add All to Cart
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => items.forEach(item => removeFromWishlist(item.id))}
                className="text-muted-foreground hover:text-destructive"
                data-testid="button-clear-wishlist"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Clear
              </Button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-primary/60" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Save your favourite plants here and order them anytime!</p>
            <Button onClick={() => setLocation('/shop')} className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
              Browse Plants <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  data-testid={`card-wishlist-${product.id}`}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
