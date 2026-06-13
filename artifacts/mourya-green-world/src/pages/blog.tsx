import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/blog';
import { Badge } from '@/components/ui/badge';

const BLOG_EMOJIS: Record<string, string> = {
  'b1': '🌿', 'b2': '🍀', 'b3': '💨', 'b4': '🌧️', 'b5': '🌱', 'b6': '🌵',
};

const blogCategories = ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    document.title = 'Plant Care Blog — Mourya Green World';
  }, []);

  const filtered = activeCategory === 'All' ? blogPosts : blogPosts.filter(p => p.category === activeCategory);
  const featured = blogPosts[0];

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background pt-16 pb-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">Plant Care Blog</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Expert tips, guides, and inspiration for plant lovers</p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Featured */}
        <Link href={`/blog/${featured.slug}`} className="group block mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6 bg-gradient-to-br from-primary/10 to-emerald-50 rounded-3xl overflow-hidden"
          >
            <div className="aspect-video md:aspect-auto bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-[100px]">
              {BLOG_EMOJIS[featured.id]}
            </div>
            <div className="p-8 flex flex-col justify-center">
              <Badge className="bg-primary/10 text-primary border-primary/20 w-fit mb-4">Featured Article</Badge>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{featured.date}</span>
                  <span>·</span>
                  <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{featured.readTime}</div>
                </div>
                <span className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
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
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-foreground hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-7xl">
                  {BLOG_EMOJIS[post.id]}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-primary border-primary/30 text-xs">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{post.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{post.excerpt}</p>
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
