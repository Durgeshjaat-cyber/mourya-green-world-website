import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Heart, ShoppingBag, MessageCircle, Star, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { usePublicData } from '@/contexts/AdminContext';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const PLANT_COLORS: Record<string, string> = {
  'p1': 'bg-emerald-50', 'p2': 'bg-teal-50', 'p3': 'bg-green-50', 'p4': 'bg-lime-50',
  'p5': 'bg-emerald-100', 'p6': 'bg-teal-100', 'p7': 'bg-green-100', 'p8': 'bg-lime-100',
  'p9': 'bg-emerald-50', 'p10': 'bg-teal-50', 'p11': 'bg-green-50', 'p12': 'bg-lime-50',
  'p13': 'bg-emerald-100', 'p14': 'bg-teal-100', 'p15': 'bg-green-100', 'p16': 'bg-lime-100',
  'p17': 'bg-pink-50', 'p18': 'bg-rose-50', 'p19': 'bg-emerald-100', 'p20': 'bg-slate-50',
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const { settings } = usePublicData();
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [, navigate] = useLocation();

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const wishlisted = isInWishlist(product.id);
  const waMsg = encodeURIComponent(`Hi! I'm interested in ${product.name} (₹${product.price}). Is it available?`);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast({ title: 'Added to cart!', description: `${product.name} has been added to your cart.` });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    toast({
      title: wishlisted ? 'Removed from wishlist' : 'Added to wishlist!',
      description: wishlisted ? undefined : `${product.name} saved to wishlist.`,
    });
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://wa.me/${settings.whatsappPrimary}?text=${waMsg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      data-testid={`card-product-${product.id}`}
      className="group bg-card border border-card-border rounded-2xl overflow-hidden flex flex-col cursor-pointer"
      style={{ boxShadow: '0 2px 8px -2px hsl(123 55% 24% / 0.08)' }}
      whileHover={{
        y: -6,
        boxShadow: '0 16px 32px -8px hsl(123 55% 24% / 0.18)',
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image area */}
      <div className="relative overflow-hidden aspect-[4/3]">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${PLANT_COLORS[product.id] || 'bg-green-50'}`}>
            <Leaf className="h-12 w-12 text-primary/30" />
          </div>
        )}

        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
          style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.isBestseller && (
            <Badge className="bg-primary text-white text-[10px] px-2 py-0.5 shadow-sm">Bestseller</Badge>
          )}
          {product.isNew && (
            <Badge className="bg-secondary text-white text-[10px] px-2 py-0.5 shadow-sm">New</Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-destructive text-white text-[10px] px-2 py-0.5 shadow-sm">{discount}% off</Badge>
          )}
        </div>

        {/* Wishlist */}
        <button
          data-testid={`button-wishlist-${product.id}`}
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/92 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200 z-10"
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors ${wishlisted ? 'text-red-500 fill-red-500' : 'text-foreground/55'}`}
          />
        </button>

        {/* Hover action bar — positioned at bottom, above image */}
        <div
          className="absolute bottom-0 left-0 right-0 flex gap-1.5 p-2.5 z-10"
          style={{
            transform: hovered ? 'translateY(0)' : 'translateY(110%)',
            opacity: hovered ? 1 : 0,
            transition: 'transform 0.22s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.22s ease',
          }}
        >
          <button
            data-testid={`button-add-cart-${product.id}`}
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-primary text-white text-xs font-semibold shadow-lg hover:bg-primary/90 active:scale-95 transition-colors"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Cart
          </button>
          <button
            data-testid={`button-whatsapp-${product.id}`}
            onClick={handleWhatsApp}
            className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center shadow-lg hover:bg-[#22c35e] active:scale-95 transition-colors"
          >
            <MessageCircle className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <div>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide mb-0.5">{product.category}</p>
          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-2.5 w-2.5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/25'}`}
            />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1.5 mt-auto pt-1">
          <span className="font-bold text-primary text-base">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
          )}
        </div>

        {/* Mobile-only add to cart */}
        <button
          data-testid={`button-add-cart-mobile-${product.id}`}
          onClick={handleAddToCart}
          className="md:hidden w-full flex items-center justify-center gap-1.5 h-8 rounded-xl bg-primary/10 text-primary text-xs font-semibold active:scale-95 transition-all"
        >
          <ShoppingBag className="h-3 w-3" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
