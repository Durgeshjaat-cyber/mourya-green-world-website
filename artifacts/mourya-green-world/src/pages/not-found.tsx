import { Link } from 'wouter';
import { Leaf, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Leaf className="h-10 w-10 text-primary/60" />
        </div>
        <h1 className="font-serif text-6xl font-bold text-primary mb-3">404</h1>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you are looking for does not exist. It may have been moved or the URL might be incorrect.
        </p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </main>
  );
}
