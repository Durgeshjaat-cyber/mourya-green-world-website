import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Leaf } from 'lucide-react';
import { blogPosts } from '@/data/blog';
import { Badge } from '@/components/ui/badge';

const BLOG_IMAGES = [
  '/images/products/plant-1.png',
  '/images/products/plant-2.png',
  '/images/products/plant-3.png',
  '/images/products/plant-4.png',
  '/images/products/plant-5.png',
  '/images/products/plant-6.png',
];

const blogCategories = ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    document.title = 'Plant Care Blog — Mourya Green World';
  }, []);

  const filtered = activeCategory === 'All' ? blogPosts : blogPosts.filter(p => p.category === activeCategory);
  const featured = blogPosts[0];
  const featuredImg = BLOG_IMAGES[0];

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/8 to-background pt-14 pb-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Learn & Grow</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">Plant Care Blog</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Expert tips, guides, and inspiration for plant lovers</p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Featured Article */}
        <Link href={`/blog/${featured.slug}`} className="group block mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-0 bg-white border border-card-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-video md:aspect-auto overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100">
              <img
                src={featuredImg}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <Badge className="bg-primary/10 text-primary border-primary/20 w-fit mb-4">Featured Article</Badge>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-snug">
                {featured.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{featured.date}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{featured.readTime}</span>
                </div>
                <span className="flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                  Read More <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {blogCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              data-testid={`chip-blog-${cat}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                  : 'border-border text-foreground/70 hover:border-primary/40 hover:text-primary bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block bg-white border border-card-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                  <img
                    src={BLOG_IMAGES[i % BLOG_IMAGES.length]}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      t.style.display = 'none';
                      if (t.parentElement) {
                        t.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 3a2 2 0 0 0 0 4c0 1.1.4 2.7 2 4s2.9 2 4 2 2.9-.4 4-2 2-2.9 2-4a2 2 0 0 0-4 0"/></svg></div>`;
                      }
                    }}
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-primary border-primary/25 text-xs font-medium">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{post.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-snug">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
