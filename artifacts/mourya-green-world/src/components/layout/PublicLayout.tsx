import { Link, useLocation } from "wouter";
import { useGetSiteSettings } from "@workspace/api-client-react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: settings } = useGetSiteSettings();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif font-semibold text-xl tracking-tight text-primary flex items-center gap-2">
            <span className="text-2xl">Mourya</span> Green World
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className={`transition-colors hover:text-primary ${location === "/" ? "text-primary" : "text-muted-foreground"}`}>Home</Link>
            <Link href="/plants" className={`transition-colors hover:text-primary ${location.startsWith("/plants") ? "text-primary" : "text-muted-foreground"}`}>Plants</Link>
            <Link href="/gallery" className={`transition-colors hover:text-primary ${location === "/gallery" ? "text-primary" : "text-muted-foreground"}`}>Gallery</Link>
            <Link href="/about" className={`transition-colors hover:text-primary ${location === "/about" ? "text-primary" : "text-muted-foreground"}`}>About</Link>
            <Link href="/contact" className={`transition-colors hover:text-primary ${location === "/contact" ? "text-primary" : "text-muted-foreground"}`}>Contact</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t bg-muted/20 py-12 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Mourya Green World</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {settings?.aboutText ? settings.aboutText.substring(0, 150) + "..." : "A premium plant nursery bringing nature to your doorstep."}
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/plants" className="hover:text-primary transition-colors">Our Plants</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {settings?.phone && <li>Phone: {settings.phone}</li>}
              {settings?.email && <li>Email: {settings.email}</li>}
              {settings?.address && <li>Address: {settings.address}</li>}
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Mourya Green World. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
