import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Search, Heart, ShoppingBag, Leaf, Home, Store } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { usePublicData } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { SearchModal } from '@/components/SearchModal';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { settings } = usePublicData();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <>
      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/92 backdrop-blur-xl shadow-md shadow-primary/8 border-b border-border/50'
          : 'bg-white border-b border-border'
      }`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -ml-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-lg font-bold text-foreground leading-tight tracking-tight">{settings.storeName}</span>
            </div>
            <span className="font-serif text-base font-bold text-foreground sm:hidden">MGW</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  location === link.path
                    ? 'text-primary'
                    : 'text-foreground/65 hover:text-foreground'
                }`}
              >
                {link.name}
                {location === link.path && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg text-foreground/65 hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link href="/wishlist" className="hidden md:flex p-2 rounded-lg text-foreground/65 hover:text-foreground hover:bg-muted transition-colors relative items-center justify-center">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="hidden md:flex p-2 rounded-lg text-foreground/65 hover:text-foreground hover:bg-muted transition-colors relative items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/shop" className="hidden md:inline-flex ml-2">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full px-5 h-9 text-sm font-medium shadow-sm shadow-primary/20">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border bg-white overflow-hidden"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      location === link.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/80 hover:bg-muted'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link href="/shop" onClick={() => setIsOpen(false)} className="mt-2">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11">
                    Shop Plants
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-border shadow-xl">
        <div className="grid grid-cols-4 h-16">
          {([
            { icon: Home, label: 'Home', path: '/' },
            { icon: Store, label: 'Shop', path: '/shop' },
            { icon: Heart, label: 'Wishlist', path: '/wishlist', count: wishlistCount },
            { icon: ShoppingBag, label: 'Cart', path: '/cart', count: cartCount },
          ] as const).map(({ icon: Icon, label, path, count }) => (
            <Link
              key={path}
              href={path}
              className={`flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
                location === path ? 'text-primary' : 'text-foreground/50'
              }`}
            >
              {location === path && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-primary rounded-full" />
              )}
              <div className="relative">
                <Icon className={`h-5 w-5 ${location === path ? 'stroke-[2.5]' : ''}`} />
                {(count as number | undefined) !== undefined && (count as number) > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium leading-none ${location === path ? 'font-semibold' : ''}`}>{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
