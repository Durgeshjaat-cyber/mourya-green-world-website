import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { SearchModal } from '@/components/SearchModal';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [location] = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Inquiry', path: '/inquiry' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 -ml-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold text-primary">🌿 Mourya Green World</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.path ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-foreground hover:text-primary transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <Link href="/wishlist" className="p-2 text-foreground hover:text-primary transition-colors relative">
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          
          <Link href="/cart" className="p-2 text-foreground hover:text-primary transition-colors relative">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-lg py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium p-2 rounded-md ${
                location === link.path ? 'bg-primary/10 text-primary' : 'text-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}