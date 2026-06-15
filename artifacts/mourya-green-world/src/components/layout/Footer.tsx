import { Link } from 'wouter';
import { Mail, MapPin, Phone, Instagram, Leaf } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePublicData } from '@/contexts/AdminContext';

export function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const { settings } = usePublicData();

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast({ title: 'Subscribed!', description: 'You will receive plant care tips and exclusive deals.' });
      setEmail('');
    }
  };

  return (
    <footer className="bg-foreground text-background mt-16 mb-16 md:mb-0">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Mourya Green World</h3>
            </div>
            <p className="text-sm text-white/65 leading-relaxed mb-6">
              A trusted plant nursery in Noida helping people create greener homes, offices, and gardens through healthy, high-quality plants.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/mouryagreenworld"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-white" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsappPrimary}?text=Hi%2C%20I'm%20interested%20in%20plants%20from%20Mourya%20Green%20World!`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#25D366] transition-colors duration-200"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-xs uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Home', path: '/' },
                { name: 'Shop Plants', path: '/shop' },
                { name: 'About Us', path: '/about' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Plant Care Blog', path: '/blog' },
                { name: 'Bulk Orders', path: '/inquiry' },
                { name: 'Contact Us', path: '/contact' },
              ].map(link => (
                <li key={link.path}>
                  <Link href={link.path} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-xs uppercase tracking-widest">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <p className="text-sm text-white/60 leading-relaxed">Mourya Nursery, Sector 94, Bandh Road, Near Okhla Bird Sanctuary, Noida, UP</p>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <a href="mailto:mouryagreenworld@gmail.com" className="text-sm text-white/60 hover:text-white transition-colors">
                  mouryagreenworld@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp className="h-4 w-4 text-accent shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsappPrimary}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  +91 98712 17876
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <a href="tel:+919958032648" className="text-sm text-white/60 hover:text-white transition-colors">
                  +91 99580 32648
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-xs uppercase tracking-widest">Stay Updated</h4>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">Get plant care tips and exclusive deals in your inbox.</p>
            <form onSubmit={handleNewsletter} className="flex flex-col gap-2.5">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-white/8 border-white/15 text-white placeholder:text-white/35 focus-visible:ring-primary h-10 rounded-xl"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white w-full h-10 rounded-xl font-medium">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Mourya Green World. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Noida, Uttar Pradesh, India
          </p>
        </div>
      </div>
    </footer>
  );
}
