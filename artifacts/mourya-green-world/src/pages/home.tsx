import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight, Leaf, Star, Truck, MessageCircle, CheckCircle,
  Sprout, Trees, Wind, Flower2, Sun, TreeDeciduous, Package,
  Home as HomeIcon, Shield, PhoneCall, Sparkles,
} from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { blogPosts } from '@/data/blog';
import { usePublicData } from '@/contexts/AdminContext';
import { useSEO } from '@/lib/useSEO';
import heroImage from '@/assets/hero.png';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Indoor Plants': HomeIcon,
  'Outdoor Plants': Trees,
  'Air Purifying Plants': Wind,
  'Lucky Plants': Sparkles,
  'Flowering Plants': Flower2,
  'Succulents': Sun,
  'Hanging Plants': Leaf,
  'Bonsai Plants': TreeDeciduous,
  'Pots & Planters': Package,
};

const benefits = [
  { icon: Leaf, title: 'Expert Care Advice', desc: 'Every plant comes with a detailed care guide. Our team is always available to help.' },
  { icon: Truck, title: 'Fresh from Nursery', desc: 'Plants are sourced and packed fresh from our nursery the day of your order.' },
  { icon: PhoneCall, title: 'WhatsApp Support', desc: 'Instant support via WhatsApp. We help you choose the right plant for your space.' },
  { icon: Shield, title: 'Quality Guaranteed', desc: 'Not happy? We replace damaged plants within 48 hours, no questions asked.' },
];

const galleryImages = [
  { src: '/images/products/plant-1.png', label: 'Indoor Collection', span: true },
  { src: '/images/products/plant-2.png', label: 'Air Purifiers' },
  { src: '/images/products/plant-3.png', label: 'Succulents' },
  { src: '/images/products/plant-4.png', label: 'Tropical Plants' },
  { src: '/images/products/plant-5.png', label: 'Lucky Plants' },
  { src: '/images/products/plant-6.png', label: 'Flowering Plants' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
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
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <main className="pb-16 md:pb-0">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Mourya Green World nursery"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-foreground/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.div variants={fadeUp}>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm mb-5 px-4 py-1.5 text-sm">
                <Sprout className="h-3.5 w-3.5 mr-1.5" />
                Premium Plant Nursery in Noida
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6 drop-shadow-lg"
            >
              Bring Nature<br />
              <span className="text-accent">Home</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed"
            >
              Premium plants delivered to your doorstep in Noida. Healthy, fresh, and expertly cared for — straight from our nursery to your home.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
              <Button
                data-testid="button-shop-now"
                size="lg"
                onClick={() => setLocation('/shop')}
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-12 text-base font-medium shadow-xl shadow-primary/30"
              >
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a
                href={`https://wa.me/${settings.whatsappPrimary}?text=Hi%2C%20I%E2%80%99m%20interested%20in%20plants%20from%20Mourya%20Green%20World!`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-whatsapp-hero"
                className="inline-flex items-center gap-2 px-8 h-12 rounded-full border-2 border-white/60 text-white font-medium text-base hover:bg-white/10 backdrop-blur-sm transition-colors"
              >
                <FaWhatsapp className="h-5 w-5 text-[#25D366]" />
                Order on WhatsApp
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-5">
              <div className="flex -space-x-2">
                {['P', 'R', 'A', 'D'].map((l, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-accent/80 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-white/75">10,000+ happy customers</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating stat cards */}
        <motion.div
          className="absolute bottom-8 right-8 hidden lg:flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {[
            { icon: Sprout, label: '500+ Varieties', sub: 'In stock now' },
            { icon: Truck, label: 'Free Delivery', sub: 'In Noida' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-xl border border-white/50">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── CATEGORIES ───────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center mb-10"
          >
            <motion.p variants={fadeUp} className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Browse by Type</motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Shop by Category
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-md mx-auto">
              Find the perfect plant for every corner of your home
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {categories.map((cat, i) => {
              const Icon = CATEGORY_ICONS[cat] || Leaf;
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={`/shop?category=${encodeURIComponent(cat)}`}
                    data-testid={`link-category-${cat}`}
                    className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-muted/60 hover:bg-primary/8 border border-transparent hover:border-primary/20 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-[11px] font-medium text-center text-foreground/80 leading-tight">{cat}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── BESTSELLERS ──────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Most Loved</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Our Bestsellers</h2>
              <p className="text-muted-foreground">Loved by thousands of plant parents</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline text-sm pb-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {bestsellers.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/shop">
              <Button variant="outline" className="border-primary text-primary rounded-full px-8 hover:bg-primary/5">
                View All Plants
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Just In</p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">New Arrivals</h2>
                <p className="text-muted-foreground">Fresh plants added to our collection</p>
              </div>
              <Link href="/shop?sort=newest" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline text-sm pb-1">
                See All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newArrivals.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Our Promise</motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Why Choose Mourya Green World
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto">
              We are more than a nursery — we are your plant partners
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center border border-card-border shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <b.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHATSAPP CTA ─────────────────────────────────────── */}
      <section className="py-14 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white translate-x-24 -translate-y-24" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white -translate-x-12 translate-y-12" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <FaWhatsapp className="h-10 w-10 text-white/80 mx-auto mb-4" />
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
            Not sure which plant to get?
          </h2>
          <p className="text-white/75 mb-7 max-w-lg mx-auto leading-relaxed">
            Chat with our plant experts on WhatsApp. We help you pick the perfect plant for your space, budget, and lifestyle.
          </p>
          <a
            href={`https://wa.me/${settings.whatsappPrimary}?text=Hi%2C%20I%20need%20help%20choosing%20a%20plant!`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-white text-primary font-semibold px-8 py-3.5 rounded-full hover:bg-white/92 transition-colors shadow-xl text-base"
          >
            <FaWhatsapp className="h-5 w-5 text-[#25D366]" />
            Chat with Us on WhatsApp
          </a>
        </div>
      </section>

      {/* ─── REVIEWS ──────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="py-16 bg-muted/40">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-12"
            >
              <motion.p variants={fadeUp} className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Happy Customers</motion.p>
              <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
                What Our Customers Say
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground">
                Trusted by thousands of plant lovers across Noida and NCR
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-5 border border-card-border shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-4 italic">"{review.text}"</p>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <p className="font-semibold text-sm text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── GALLERY ──────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Our Green World</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Nursery Gallery</h2>
              <p className="text-muted-foreground">A glimpse into our lush collection</p>
            </div>
            <Link href="/gallery" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline text-sm pb-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer ${img.span ? 'md:row-span-2' : ''}`}
                style={{ aspectRatio: img.span ? 'auto' : '1/1', minHeight: img.span ? '0' : undefined }}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ height: img.span ? '100%' : undefined }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) parent.style.background = 'linear-gradient(135deg, #e8f5e9, #c8e6c9)';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-semibold">{img.label}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/gallery">
              <Button variant="outline" className="border-primary text-primary rounded-full px-8 hover:bg-primary/5">
                View Full Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── INSTAGRAM ────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Stay Connected</p>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Follow Our Journey</h2>
          <a
            href="https://instagram.com/mouryagreenworld"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground font-medium hover:text-primary transition-colors mb-10"
          >
            <FaInstagram className="h-4 w-4" />
            @mouryagreenworld
          </a>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4">
            {[
              '/images/products/plant-1.png',
              '/images/products/plant-2.png',
              '/images/products/plant-3.png',
              '/images/products/plant-4.png',
              '/images/products/plant-5.png',
              '/images/products/plant-6.png',
            ].map((src, i) => (
              <motion.a
                key={i}
                href="https://instagram.com/mouryagreenworld"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="aspect-square rounded-xl overflow-hidden relative group bg-muted"
              >
                <img
                  src={src}
                  alt="Plant"
                  className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center rounded-xl">
                  <FaInstagram className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BLOG PREVIEW ─────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Learn & Grow</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Plant Care Tips</h2>
              <p className="text-muted-foreground">Expert advice for thriving plants</p>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline text-sm pb-1">
              All Articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {blogPosts.slice(0, 3).map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block bg-white border border-card-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div
                    className="aspect-video bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={`/images/products/plant-${(i % 6) + 1}.png`}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                    />
                  </div>
                  <div className="p-5">
                    <Badge variant="outline" className="text-primary border-primary/25 text-xs mb-3 font-medium">{post.category}</Badge>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-snug">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ───────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-primary/8 via-background to-accent/15">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Leaf className="h-7 w-7 text-primary" />
              </div>
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Get Plant Care Tips Delivered
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              Subscribe for plant care guides, seasonal tips, and exclusive deals from our nursery.
            </motion.p>
            <motion.form
              variants={fadeUp}
              onSubmit={e => { e.preventDefault(); }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-sm"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-full px-7 font-medium shadow-sm shadow-primary/20">
                Subscribe
              </Button>
            </motion.form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
