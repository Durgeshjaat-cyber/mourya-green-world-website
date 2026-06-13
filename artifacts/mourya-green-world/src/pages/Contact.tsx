import { useGetSiteSettings, useSubmitInquiry } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { data: settings } = useGetSiteSettings();
  const { toast } = useToast();
  const submitInquiry = useSubmitInquiry();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    submitInquiry.mutate(
      { data: { name: values.name, email: values.email, phone: values.phone, message: values.message } },
      {
        onSuccess: () => {
          toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
          form.reset();
        },
        onError: () => toast({ title: "Error", description: "Please try again.", variant: "destructive" }),
      }
    );
  };

  const contactItems = [
    { label: "Phone", value: settings?.phone, icon: Phone, href: settings?.phone ? `tel:${settings.phone}` : undefined },
    { label: "WhatsApp", value: settings?.whatsapp, icon: MessageCircle, href: settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : undefined },
    { label: "Email", value: settings?.email, icon: Mail, href: settings?.email ? `mailto:${settings.email}` : undefined },
    { label: "Address", value: settings?.address, icon: MapPin, href: undefined },
  ];

  return (
    <PublicLayout>
      <section className="py-16 bg-gradient-to-b from-emerald-50 dark:from-emerald-950/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Contact Us</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Get in Touch</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">We're here to help you find the perfect plant. Reach out with any questions.</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold mb-3">Contact Information</h2>
                <p className="text-muted-foreground">Multiple ways to reach us. We're always happy to assist.</p>
              </div>
              <div className="space-y-5">
                {contactItems.filter(c => c.value).map((item) => {
                  const Icon = item.icon;
                  const inner = (
                    <div className="flex items-center gap-4 group p-4 rounded-xl border border-border hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</div>
                        <div className="font-medium text-foreground">{item.value}</div>
                      </div>
                    </div>
                  );
                  return item.href ? (
                    <a key={item.label} href={item.href} target={item.label === "WhatsApp" ? "_blank" : undefined} rel="noopener noreferrer">
                      {inner}
                    </a>
                  ) : <div key={item.label}>{inner}</div>;
                })}
              </div>
            </div>

            {/* Form */}
            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
              <h2 className="text-xl font-serif font-semibold mb-6">Send a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Name</FormLabel><FormControl><Input data-testid="input-name" placeholder="Your name" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input data-testid="input-phone" placeholder="+91 98765 43210" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input data-testid="input-email" type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          data-testid="textarea-message"
                          rows={5}
                          placeholder="Tell us about your plant needs..."
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full rounded-full gap-2" disabled={submitInquiry.isPending} data-testid="button-submit-contact">
                    <Send className="w-4 h-4" />
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
