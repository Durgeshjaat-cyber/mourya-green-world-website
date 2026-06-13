import { useState } from 'react';
import { Link } from 'wouter';
import { Heart, ShoppingBag, MessageCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

const PLANT_COLORS: Record<string, string> = {
  'p1': 'bg-emerald-100',
  'p2': 'bg-teal-100',
  'p3': 'bg-green-100',
  'p4': 'bg-lime-100',
  'p5': 'bg-emerald-200',
  'p6': 'bg-teal-200',
  'p7': 'bg-green-200',
  'p8': 'bg-lime-200',
  'p9': 'bg-emerald-50',
  'p10': 'bg-teal-50',
  'p11': 'bg-green-50',
  'p12': 'bg-lime-50',
  'p13': 'bg-emerald-100',
  'p14': 'bg-teal-100',
  'p15': 'bg-green-100',
  'p16': 'bg-lime-100',
  'p17': 'bg-pink-50',
  'p18': 'bg-rose-50',
  'p19': 'bg-emerald-200',
  'p20': 'bg-slate-100',
};

const PLANT_EMOJIS: Record<string, string> = {
  'Indoor Plants': '🌿',
  'Outdoor Plants': '🌱',
  'Air Purifying Plants': '💨',
  'Lucky Plants': '🍀',
  'Flowering Plants': '🌸',
  'Succulents': '🌵',
  'Hanging Plants': '🪴',
  'Bonsai Plants': '🌳',
  'Pots & Planters': '🏺',
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [imgError, setImgError] = useState(false);

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const wishlisted = isInWishlist(product.id);
  const waMsg = encodeURIComponent(`Hi! I'm interested in ${product.name} (₹${product.price}). Is it available?`);

  const handleAddToCart = () => {
    addToCart(product);
    toast({ title: 'Added to cart!', description: `${product.name} has been added to your cart.` });
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    toast({
      title: wishlisted ? 'Removed from wishlist' : 'Added to wishlist!',
      description: wishlisted ? undefined : `${product.name} saved to wishlist.`,
    });
  };

  return (
    <motion.div
      data-testid={`card-product-${product.id}`}
      className="group bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Image area */}
      <div className="relative overflow-hidden aspect-square">
        <Link href={`/product/${product.id}`}>
          {!imgError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-6xl ${PLANT_COLORS[product.id] || 'bg-green-50'}`}>
              {PLANT_EMOJIS[product.category] || '🌿'}
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isBestseller && (
            <Badge className="bg-primary text-white text-[10px] px-2 py-0.5">Bestseller</Badge>
          )}
          {product.isNew && (
            <Badge className="bg-secondary text-white text-[10px] px-2 py-0.5">New</Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-destructive text-white text-[10px] px-2 py-0.5">{discount}% off</Badge>
          )}
        </div>

        {/* Wishlist */}
        <button
          data-testid={`button-wishlist-${product.id}`}
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${wishlisted ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-foreground hover:text-primary transition-colors leading-tight line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary text-lg">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-auto">
          <Button
            data-testid={`button-add-cart-${product.id}`}
            onClick={handleAddToCart}
            size="sm"
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
            Add to Cart
          </Button>
          <a
            href={`https://wa.me/919876543210?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`button-whatsapp-${product.id}`}
            className="flex items-center justify-center gap-1.5 text-xs text-[#25D366] font-medium py-1.5 border border-[#25D366]/30 rounded-lg hover:bg-[#25D366]/5 transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp Inquiry
          </a>
        </div>
      </div>
    </motion.div>
  );
}
