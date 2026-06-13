import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { products } from '@/data/products';
import { Input } from '@/components/ui/input';

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setQuery('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/shop?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="container mx-auto px-4 pt-20 max-w-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <form onSubmit={handleSearch} className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <Input
            autoFocus
            type="search"
            placeholder="Search for plants, pots..."
            className="w-full h-16 pl-14 pr-4 text-xl rounded-full border-2 border-primary/20 focus-visible:border-primary shadow-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {query.trim() !== '' && (
          <div className="bg-card border rounded-2xl shadow-xl overflow-hidden">
            {results.length > 0 ? (
              <div className="flex flex-col">
                <div className="px-6 py-3 text-sm font-medium text-muted-foreground bg-muted/50 border-b">
                  Products
                </div>
                {results.map(product => (
                  <Link 
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors border-b last:border-0"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded-md bg-muted"
                    />
                    <div>
                      <h4 className="font-medium text-foreground">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="ml-auto font-medium">
                      ₹{product.price}
                    </div>
                  </Link>
                ))}
                <button 
                  onClick={handleSearch}
                  className="w-full py-4 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                >
                  View all results
                </button>
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                No results found for "{query}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}