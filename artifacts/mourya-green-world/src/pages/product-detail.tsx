import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, MessageCircle, Heart, Truck, RotateCcw, Sun, Droplets, TrendingUp, CheckCircle, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePublicData } from '@/contexts/AdminContext';
import { useSEO } from '@/lib/useSEO';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/ProductCard';

const PLANT_COLORS: Record<string, string> = {
  'p1': 'bg-emerald-100', 'p2': 'bg-teal-100', 'p3': 'bg-green-100', 'p4': 'bg-lime-100',
  'p5': 'bg-emerald-200', 'p6': 'bg-teal-200', 'p7': 'bg-green-200', 'p8': 'bg-lime-200',
  'p9': 'bg-emerald-50', 'p10': 'bg-teal-50', 'p11': 'bg-green-50', 'p12': 'bg-lime-50',
  'p13': 'bg-emerald-100', 'p14': 'bg-teal-100', 'p15': 'bg-green-100', 'p16': 'bg-lime-100',
  'p17': 'bg-pink-50', 'p18': 'bg-rose-50', 'p19': 'bg-emerald-200', 'p20': 'bg-slate-100',
};

const PLANT_EMOJIS: Record<string, string> = {
  'Indoor Plants': '🌿', 'Outdoor Plants': '🌱', 'Air Purifying Plants': '💨',
  'Lucky Plants': '🍀', 'Flowering Plants': '🌸', 'Succulents': '🌵',
  'Hanging Plants': '🪴', 'Bonsai Plants': '🌳', 'Pots & Planters': '🏺',
};

const _staticReviews = [
  { name: 'Priya S.', rating: 5, text: 'Plant arrived in perfect condition! Beautifully packaged and healthy.', date: 'Dec 2024' },
  { name: 'Rahul V.', rating: 5, text: 'Great quality. The care guide really helped me keep it thriving.', date: 'Nov 2024' },
  { name: 'Anjali M.', rating: 4, text: 'Happy with the purchase. Quick delivery within Noida.', date: 'Oct 2024' },
];

export default function ProductDetail() {
  const { products, settings, reviews } = usePublicData();
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const product = products.find(p => p.id === params.id);

  // All images for gallery: primary + extras
  const allImages = product ? [product.image, ...(product.images ?? [])].filter(Boolean) : [];

  useSEO({
    title: product ? `${product.name} — Mourya Green World` : 'Plant — Mourya Green World',
    description: product ? `${product.description.slice(0, 150)}. Buy ${product.name} online from Mourya Green World, Noida. ₹${product.price} only.` : undefined,
  });

  useEffect(() => {
    setActiveImgIdx(0);
    window.scrollTo(0, 0);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-6xl">🌿</p>
        <h2 className="font-serif text-2xl font-bold">Plant not found</h2>
        <Link href="/shop"><Button className="bg-primary text-white">Back to Shop</Button></Link>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const wishlisted = isInWishlist(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const waMsg = encodeURIComponent(`Hi! I want to order ${quantity}x ${product.name} (₹${product.price * quantity}). Please confirm availability.`);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({ title: 'Added to cart!', description: `${quantity}x ${product.name} added to your cart.` });
  };

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-4 pt-6 pb-4">
        <button onClick={() => setLocation('/shop')} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </button>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            {/* Main image */}
            <div className={`relative aspect-square rounded-3xl overflow-hidden ${PLANT_COLORS[product.id] || 'bg-green-50'} flex items-center justify-center group`}>
              {allImages[activeImgIdx] && !imgError ? (
                <img
                  key={activeImgIdx}
                  src={allImages[activeImgIdx]}
                  alt={`${product.name} photo ${activeImgIdx + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-[160px]">{PLANT_EMOJIS[product.category] || '🌿'}</span>
              )}
              {/* Prev/Next arrows when multiple images */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => { setImgError(false); setActiveImgIdx(i => (i - 1 + allImages.length) % allImages.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => { setImgError(false); setActiveImgIdx(i => (i + 1) % allImages.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                  {/* Dot indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setImgError(false); setActiveImgIdx(i); }}
                        className={`w-2 h-2 rounded-full transition-all ${i === activeImgIdx ? 'bg-primary w-5' : 'bg-white/70'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setImgError(false); setActiveImgIdx(i); }}
                    className={`w-16 h-16 rounded-xl border-2 shrink-0 overflow-hidden ${PLANT_COLORS[product.id] || 'bg-green-50'} flex items-center justify-center transition-all ${i === activeImgIdx ? 'border-primary shadow-sm' : 'border-border hover:border-primary/40'}`}
                  >
                    {img ? (
                      <img src={img} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <span className="text-2xl">{PLANT_EMOJIS[product.category] || '🌿'}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {/* Emoji thumbnails if no images */}
            {allImages.filter(Boolean).length === 0 && (
              <div className="flex gap-3 mt-4">
                {[0, 1, 2].map(i => (
                  <div key={i} className={`w-16 h-16 rounded-xl border-2 ${i === 0 ? 'border-primary' : 'border-border'} ${PLANT_COLORS[product.id] || 'bg-green-50'} flex items-center justify-center text-2xl`}>
                    {PLANT_EMOJIS[product.category] || '🌿'}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-primary border-primary/30">{product.category}</Badge>
                {product.isBestseller && <Badge className="bg-primary text-white">Bestseller</Badge>}
                {product.isNew && <Badge className="bg-secondary text-white">New</Badge>}
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-muted'}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-primary text-4xl">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20">{discount}% off</Badge>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={product.inStock ? 'text-green-700' : 'text-red-600'}>
                {product.inStock ? 'In Stock — Ready to ship' : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  data-testid="button-qty-dec"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  data-testid="button-qty-inc"
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Button
                  data-testid="button-add-to-cart"
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 text-base"
                  disabled={!product.inStock}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" /> Add to Cart
                </Button>
                <button
                  data-testid="button-wishlist"
                  onClick={() => { toggleWishlist(product); toast({ title: wishlisted ? 'Removed from wishlist' : 'Added to wishlist!' }); }}
                  className="w-12 h-12 rounded-lg border border-border flex items-center justify-center hover:border-red-300 transition-colors"
                >
                  <Heart className={`h-5 w-5 ${wishlisted ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`} />
                </button>
              </div>
              <a
                href={`https://wa.me/${settings.whatsappPrimary}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-buy-whatsapp"
                className="flex items-center justify-center gap-2 h-12 rounded-lg border-2 border-[#25D366] text-[#25D366] font-semibold text-base hover:bg-[#25D366]/5 transition-colors"
              >
                <MessageCircle className="h-5 w-5" /> Order on WhatsApp
              </a>
            </div>

            {/* Delivery info */}
            <div className="border border-border rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="font-medium">Free delivery in Noida</p>
                  <p className="text-muted-foreground text-xs">5–7 business day delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="font-medium">Easy returns</p>
                  <p className="text-muted-foreground text-xs">Damaged plant? We replace within 48 hours</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Plant Care Guide */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Plant Care Guide</h2>
          <Tabs defaultValue="sunlight">
            <TabsList className="mb-6">
              <TabsTrigger value="sunlight" className="flex items-center gap-2"><Sun className="h-4 w-4" /> Sunlight</TabsTrigger>
              <TabsTrigger value="water" className="flex items-center gap-2"><Droplets className="h-4 w-4" /> Water</TabsTrigger>
              <TabsTrigger value="growth" className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Growth</TabsTrigger>
              <TabsTrigger value="benefits" className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Benefits</TabsTrigger>
            </TabsList>
            <TabsContent value="sunlight">
              <div className="bg-amber-50 rounded-2xl p-6 flex items-start gap-4">
                <Sun className="h-8 w-8 text-amber-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Sunlight Requirements</h3>
                  <p className="text-muted-foreground">{product.careTips.sunlight}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="water">
              <div className="bg-blue-50 rounded-2xl p-6 flex items-start gap-4">
                <Droplets className="h-8 w-8 text-blue-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Watering Guide</h3>
                  <p className="text-muted-foreground">{product.careTips.water}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="growth">
              <div className="bg-green-50 rounded-2xl p-6 flex items-start gap-4">
                <TrendingUp className="h-8 w-8 text-green-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Growth Information</h3>
                  <p className="text-muted-foreground">{product.careTips.growth}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="benefits">
              <div className="bg-primary/5 rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Benefits</h3>
                <ul className="space-y-2">
                  {product.careTips.benefits.map(b => (
                    <li key={b} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mb-16">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviews.slice(0, 3).map(r => (
                <div key={r.id} className="bg-card border border-card-border rounded-2xl p-5">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-muted'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-foreground mb-3">"{r.text}"</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium">{r.name}</span>
                    <span>{r.location} · {r.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Related Plants</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
