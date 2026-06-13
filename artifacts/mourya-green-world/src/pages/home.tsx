import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Star, Truck, MessageCircle, Phone, CheckCircle } from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { blogPosts } from '@/data/blog';
import { usePublicData } from '@/contexts/AdminContext';
import { useSEO } from '@/lib/useSEO';

const CATEGORY_ICONS: Record<string, string> = {
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


const benefits = [
  { icon: Leaf, title: 'Expert Care Advice', desc: 'Every plant comes with a detailed care guide. Our team is always available to answer your questions.' },
  { icon: Truck, title: 'Fresh from Nursery', desc: 'Plants are sourced and packed fresh from our nursery the day of your order.' },
  { icon: MessageCircle, title: 'WhatsApp Support', desc: 'Instant support via WhatsApp. We help you choose the right plant for your space.' },
  { icon: CheckCircle, title: 'Quality Guaranteed', desc: 'Not happy? We replace damaged plants within 48 hours, no questions asked.' },
];

const galleryImages = [
  { emoji: '🌿', color: 'bg-emerald-100', label: 'Indoor Collection' },
  { emoji: '🌸', color: 'bg-pink-50', label: 'Flowering Plants' },
  { emoji: '🌵', color: 'bg-lime-100', label: 'Succulents' },
  { emoji: '🌳', color: 'bg-teal-100', label: 'Bonsai' },
  { emoji: '🪴', color: 'bg-green-100', label: 'Hanging Plants' },
  { emoji: '🍀', color: 'bg-emerald-50', label: 'Lucky Plants' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const [, setLocation] = useLocation();
  const { products, categories, settings, reviews } = usePublicData();

  useSEO({
    title: 'Mourya Green World — Bring Nature Home',
    description: 'Buy premium indoor plants, outdoor plants, air purifying plants, lucky plants, succulents and more. Fresh from our nursery in Noida. WhatsApp to order today!',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bestsellers = products.filter(p => p.isBestseller).slice(0, 6);

  return (
    <main>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {['🌿', '🌱', '🍃', '🌸', '🌿', '🌱'].map((e, i) => (
            <motion.span
              key={i}
              className="absolute text-5xl opacity-10"
              style={{ left: `${10 + i * 16}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            >
              {e}
            </motion.span>
          ))}
        </div>

        <div className="container mx-auto px-4 py-20 grid md:grid-cols-2 items-center gap-12">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                Premium Plant Nursery in Noida
              </Badge>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6">
              Bring Nature<br />
              <span className="text-primary">Home</span> 🌿
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Premium plants delivered to your doorstep in Noida. Healthy, fresh, and expertly cared for — straight from our nursery to your home.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Button
                data-testid="button-shop-now"
                size="lg"
                onClick={() => setLocation('/shop')}
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 text-base shadow-lg shadow-primary/25"
              >
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a
                href={`https://wa.me/${settings.whatsappPrimary}?text=Hi%2C%20I%E2%80%99m%20interested%20in%20plants%20from%20Mourya%20Green%20World!`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-whatsapp-hero"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#25D366] text-[#25D366] font-semibold text-base hover:bg-[#25D366]/5 transition-colors"
              >
                <FaWhatsapp className="h-5 w-5" />
                Order on WhatsApp
              </a>
            </motion.div>
            <motion.div variants={fadeUp} className="flex items-center gap-6 mt-8">
              <div className="flex -space-x-2">
                {['P', 'R', 'A', 'D'].map((l, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center text-xs font-bold text-primary">{l}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-xs text-muted-foreground">10,000+ happy customers</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 rounded-[40%_60%_60%_40%/40%_40%_60%_60%] bg-gradient-to-br from-primary/20 to-emerald-200/30" />
              <div className="absolute inset-8 rounded-[40%_60%_60%_40%/40%_40%_60%_60%] bg-gradient-to-br from-primary/10 to-emerald-100/40 flex items-center justify-center text-[160px]">
                🌿
              </div>
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-2xl">🌱</span>
                <div>
                  <p className="text-xs font-semibold">500+ Plant Varieties</p>
                  <p className="text-[10px] text-muted-foreground">In stock now</p>
                </div>
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="text-xs font-semibold">Free Delivery</p>
                  <p className="text-[10px] text-muted-foreground">In Noida</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-10"
          >
            <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Shop by Category
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground">Find the perfect plant for every corner of your home</motion.p>
          </motion.div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(cat)}`}
                  data-testid={`link-category-${cat}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/50 hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all group cursor-pointer"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{CATEGORY_ICONS[cat]}</span>
                  <span className="text-xs font-medium text-center text-foreground leading-tight">{cat}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Our Bestsellers</h2>
              <p className="text-muted-foreground">Loved by thousands of plant parents</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {bestsellers.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link href="/shop">
              <Button variant="outline" className="border-primary text-primary rounded-full px-8">View All Plants</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Why Choose Mourya Green World
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto">
              We are more than a nursery — we are your plant partners
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-muted/30 rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <b.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHATSAPP BANNER */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
            Not sure which plant to get?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Chat with our plant experts on WhatsApp. We help you pick the perfect plant for your space, budget, and lifestyle.
          </p>
          <a
            href={`https://wa.me/${settings.whatsappPrimary}?text=Hi%2C%20I%20need%20help%20choosing%20a%20plant!`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3 rounded-full hover:bg-white/90 transition-colors shadow-lg"
          >
            <FaWhatsapp className="h-5 w-5 text-[#25D366]" />
            Chat with Us on WhatsApp
          </a>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">What Our Customers Say</h2>
            <p className="text-muted-foreground">Trusted by thousands of plant lovers across Noida & NCR</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-card-border"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">"{review.text}"</p>
                <div>
                  <p className="font-semibold text-sm text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Our Nursery Gallery</h2>
              <p className="text-muted-foreground">A glimpse into our green world</p>
            </div>
            <Link href="/gallery" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`${img.color} rounded-2xl aspect-square flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition-shadow ${i === 0 ? 'md:row-span-2 aspect-auto' : ''}`}
              >
                <span className="text-6xl">{img.emoji}</span>
                <span className="text-sm font-medium text-foreground/70">{img.label}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link href="/gallery">
              <Button variant="outline" className="border-primary text-primary rounded-full px-8">View Full Gallery</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Follow Us on Instagram</h2>
          <a
            href="https://instagram.com/mouryagreenworld"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline mb-10"
          >
            <FaInstagram className="h-4 w-4" />
            @mouryagreenworld
          </a>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4">
            {['🌿', '🌸', '🌵', '🪴', '🍃', '🌺'].map((em, i) => (
              <motion.a
                key={i}
                href="https://instagram.com/mouryagreenworld"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="aspect-square bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center text-4xl hover:scale-105 transition-transform cursor-pointer overflow-hidden relative group"
              >
                <span>{em}</span>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors rounded-xl flex items-center justify-center">
                  <FaInstagram className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Plant Care Tips</h2>
              <p className="text-muted-foreground">Expert advice for thriving plants</p>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline">
              All Articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl mb-4 flex items-center justify-center text-6xl group-hover:shadow-md transition-shadow">
                    🌿
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/30 text-xs mb-2">{post.category}</Badge>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-emerald-100/60">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
            Get Plant Care Tips Delivered
          </h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for plant care guides, seasonal tips, and exclusive deals.
          </p>
          <form
            onSubmit={e => { e.preventDefault(); }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
