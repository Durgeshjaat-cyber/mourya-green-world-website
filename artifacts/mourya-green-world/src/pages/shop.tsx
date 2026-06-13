import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { usePublicData } from '@/contexts/AdminContext';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Shop() {
  const { products, categories } = usePublicData();
  const [location] = useLocation();
  const params = new URLSearchParams(location.includes('?') ? location.split('?')[1] : '');
  const initialCategory = params.get('category') || 'All';
  const initialSearch = params.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    document.title = 'Shop Plants — Mourya Green World';
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'newest': list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'popular': default: list.sort((a, b) => b.reviews - a.reviews); break;
    }
    return list;
  }, [activeCategory, searchQuery, sortBy]);

  const allCats = ['All', ...categories];

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-muted/40 to-background pt-12 pb-8">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">Our Plant Collection</h1>
          <p className="text-muted-foreground">
            {filtered.length} plants available
            {activeCategory !== 'All' && ` in ${activeCategory}`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-testid="input-shop-search"
              type="search"
              placeholder="Search plants..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-44" data-testid="select-sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="sm:hidden flex items-center gap-2"
            onClick={() => setShowFilters(v => !v)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Category chips */}
        <div className={`${showFilters ? 'block' : 'hidden sm:block'} mb-6`}>
          <div className="flex flex-wrap gap-2">
            {allCats.map(cat => (
              <button
                key={cat}
                data-testid={`chip-category-${cat}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white border-primary shadow-sm shadow-primary/25'
                    : 'border-border text-foreground hover:border-primary hover:text-primary bg-background'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({products.filter(p => p.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter tags */}
        {(activeCategory !== 'All' || searchQuery) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeCategory !== 'All' && (
              <Badge
                variant="secondary"
                className="gap-1 cursor-pointer"
                onClick={() => setActiveCategory('All')}
              >
                {activeCategory} <X className="h-3 w-3" />
              </Badge>
            )}
            {searchQuery && (
              <Badge
                variant="secondary"
                className="gap-1 cursor-pointer"
                onClick={() => setSearchQuery('')}
              >
                "{searchQuery}" <X className="h-3 w-3" />
              </Badge>
            )}
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {filtered.map(product => (
              <motion.div
                key={product.id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2">No plants found</h3>
            <p className="text-muted-foreground mb-6">Try a different search or category</p>
            <Button
              variant="outline"
              className="border-primary text-primary"
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
