import { Link } from "wouter";
import { useGetSiteSettings, useGetFeaturedPlants, useListCategories } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Phone, Mail, MapPin, MessageCircle, Leaf, Sun, Droplets, ChevronRight } from "lucide-react";
import { useSubmitInquiry } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  message: z.string().min(5, "Message is required"),
});

export default function Home() {
  const { data: settings } = useGetSiteSettings();
  const { data: featuredPlants = [] } = useGetFeaturedPlants();
  const { data: categories = [] } = useListCategories();
  const { toast } = useToast();
  const submitInquiry = useSubmitInquiry();

  const form = useForm<z.infer<typeof inquirySchema>>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const onSubmit = (values: z.infer<typeof inquirySchema>) => {
    submitInquiry.mutate(
      { data: { name: values.name, email: values.email, phone: values.phone, message: values.message } },
      {
        onSuccess: () => {
          toast({ title: "Message sent!", description: "We'll get back to you soon." });
          form.reset();
        },
        onError: () => {
          toast({ title: "Failed to send", description: "Please try again.", variant: "destructive" });
        },
      }
    );
  };

  const services = [
    { title: settings?.service1Title || "Premium Plants", desc: settings?.service1Desc || "Carefully sourced plants", icon: Leaf },
    { title: settings?.service2Title || "Expert Consultation", desc: settings?.service2Desc || "Personalized plant advice", icon: Sun },
    { title: settings?.service3Title || "Home Delivery", desc: settings?.service3Desc || "Safe plant delivery", icon: Droplets },
    { title: settings?.service4Title || "Landscape Design", desc: settings?.service4Desc || "Transform your space", icon: MapPin },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-teal-900">
        {settings?.heroBannerUrl && (
          <div className="absolute inset-0">
            <img src={settings.heroBannerUrl} alt="Hero banner" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 via-green-900/60 to-transparent" />
          </div>
        )}
        <div className="relative container mx-auto px-4 text-center text-white max-w-4xl">
          <Badge className="mb-6 bg-emerald-500/20 text-emerald-200 border-emerald-500/30 text-sm px-4 py-1.5">
            Premium Plant Nursery
          </Badge>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
            {settings?.heroTitle || "Welcome to Mourya Green World"}
          </h1>
          <p className="text-lg md:text-xl text-emerald-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            {settings?.heroSubtitle || "Your trusted plant nursery for premium quality plants and gardening services"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plants">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-6 text-base font-medium rounded-full gap-2">
                Explore Plants <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base font-medium rounded-full">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Browse by Category</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Find the perfect plant for every corner of your home and garden</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((cat) => (
                <Link key={cat.id} href={`/plants?categoryId=${cat.id}`}>
                  <div className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Leaf className="w-7 h-7 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-foreground leading-tight">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Plants */}
      {featuredPlants.length > 0 && (
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-serif font-bold text-foreground mb-2">Featured Plants</h2>
                <p className="text-muted-foreground">Handpicked selections from our nursery</p>
              </div>
              <Link href="/plants">
                <Button variant="outline" className="hidden sm:flex gap-2">
                  View All <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPlants.slice(0, 8).map((plant) => (
                <Link key={plant.id} href={`/plants/${plant.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-border/50">
                    <div className="aspect-square overflow-hidden bg-emerald-50">
                      {plant.imageUrl ? (
                        <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Leaf className="w-16 h-16 text-emerald-200" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-foreground">{plant.name}</h3>
                          {plant.categoryName && (
                            <Badge variant="secondary" className="mt-1 text-xs">{plant.categoryName}</Badge>
                          )}
                        </div>
                        {plant.price && (
                          <span className="text-emerald-600 font-bold text-lg">{plant.price}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link href="/plants"><Button variant="outline">View All Plants</Button></Link>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to create your perfect green space</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <div key={i} className="group p-8 rounded-2xl border border-border hover:border-emerald-500/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 font-serif">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-green-950 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">About Mourya Green World</h2>
            <p className="text-emerald-100/80 text-lg leading-relaxed mb-8">
              {settings?.aboutText || "A family-owned plant nursery dedicated to bringing nature's beauty to your home and garden. We specialize in a wide variety of indoor and outdoor plants with over 15 years of experience."}
            </p>
            <Link href="/about">
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-full px-8">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-10 leading-relaxed">
                Have a question about plants or need help choosing the right one? We'd love to hear from you.
              </p>
              <div className="space-y-6">
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Phone</div>
                      <div className="font-medium">{settings.phone}</div>
                    </div>
                  </a>
                )}
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">WhatsApp</div>
                      <div className="font-medium">{settings.whatsapp}</div>
                    </div>
                  </a>
                )}
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Email</div>
                      <div className="font-medium">{settings.email}</div>
                    </div>
                  </a>
                )}
                {settings?.address && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Address</div>
                      <div className="font-medium">{settings.address}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
              <h3 className="text-xl font-serif font-semibold mb-6">Send us a Message</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl><Input placeholder="Ramesh Kumar" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input type="email" placeholder="ramesh@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={4}
                          placeholder="Tell us what you're looking for..."
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full rounded-full" disabled={submitInquiry.isPending}>
                    {submitInquiry.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
