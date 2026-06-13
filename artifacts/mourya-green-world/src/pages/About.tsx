import { Link } from "wouter";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Heart, Star, Users } from "lucide-react";

export default function About() {
  const { data: settings } = useGetSiteSettings();

  const values = [
    { icon: Leaf, title: "Quality First", desc: "Every plant is carefully selected and nurtured to ensure the highest quality before reaching your home." },
    { icon: Heart, title: "Passion for Plants", desc: "We are plant enthusiasts at heart. Our love for greenery drives everything we do." },
    { icon: Star, title: "Expert Knowledge", desc: "With 15+ years of experience, we offer trusted advice on plant care and gardening." },
    { icon: Users, title: "Community Focus", desc: "We believe in building a greener community, one garden at a time." },
  ];

  return (
    <PublicLayout>
      <section className="py-16 bg-gradient-to-b from-emerald-50 dark:from-emerald-950/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Our Story</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">About Mourya Green World</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">A family-run nursery with a deep love for plants and nature</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-lg text-foreground/80 leading-relaxed">
            {settings?.aboutText || "Mourya Green World is a family-owned plant nursery dedicated to bringing nature's beauty to your home and garden. We specialize in a wide variety of indoor and outdoor plants, offering expert care advice and premium quality plants at affordable prices. With over 15 years of experience, we are committed to helping you create the green space of your dreams."}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} className="bg-card rounded-2xl border border-border p-7 text-center hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3 font-serif">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-green-950 text-white text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-serif font-bold mb-4">Ready to Start Your Green Journey?</h2>
          <p className="text-emerald-100/80 mb-8 leading-relaxed">Visit us or get in touch to explore our full collection of plants and services.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/plants">
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-full px-8">Explore Plants</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
