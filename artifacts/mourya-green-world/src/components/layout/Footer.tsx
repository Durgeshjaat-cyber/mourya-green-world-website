import { Link } from 'wouter';
import { Mail, MapPin, Phone, Instagram } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast({ title: 'Subscribed!', description: 'You will receive plant care tips and exclusive deals.' });
      setEmail('');
    }
  };

  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4 text-white">🌿 Mourya Green World</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              A trusted plant nursery in Noida helping people create greener homes, offices, and gardens through healthy, high-quality plants.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/mouryagreenworld"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-white" />
              </a>
              <a
                href="https://wa.me/919876543210?text=Hi%2C%20I'm%20interested%20in%20plants%20from%20Mourya%20Green%20World!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wide text-xs">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Shop Plants', path: '/shop' },
                { name: 'About Us', path: '/about' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Plant Care Blog', path: '/blog' },
                { name: 'Contact Us', path: '/contact' },
              ].map(link => (
                <li key={link.path}>
                  <Link href={link.path} className="text-sm text-white/70 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wide text-xs">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-white/70">Mourya Nursery, Sector 94, Bandh Road, Near Okhla Bird Sanctuary, Noida, UP</p>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:mouryagreenworld@gmail.com" className="text-sm text-white/70 hover:text-white transition-colors">
                  mouryagreenworld@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wide text-xs">Stay Updated</h4>
            <p className="text-sm text-white/70 mb-4">Get plant care tips and exclusive deals in your inbox.</p>
            <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-primary"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Mourya Green World. All rights reserved.
          </p>
          <p className="text-xs text-white/50">
            Noida, Uttar Pradesh, India
          </p>
        </div>
      </div>
    </footer>
  );
}
