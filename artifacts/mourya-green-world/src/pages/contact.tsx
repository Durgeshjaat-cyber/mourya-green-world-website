import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

const faqs = [
  { q: 'Do you deliver outside Noida?', a: 'Yes! We deliver across the entire Delhi NCR region including Delhi, Gurgaon, Faridabad, and Ghaziabad. Delivery charges may apply outside Noida.' },
  { q: 'How do plants stay fresh during delivery?', a: 'We use special plant-safe packaging with breathable materials. All plants are packed with moist soil and dispatched within 24 hours of your order.' },
  { q: 'Can I visit the nursery?', a: 'Absolutely! We welcome plant lovers to visit our nursery at Sector 94, Bandh Road, Near Okhla Bird Sanctuary, Noida. We are open daily from 9:00 AM to 7:00 PM.' },
  { q: 'Do you offer bulk or corporate discounts?', a: 'Yes, we offer special pricing for bulk orders and corporate office greening projects. Please contact us on WhatsApp or email for a custom quote.' },
  { q: 'What if my plant arrives damaged?', a: 'Your satisfaction is our priority. If your plant arrives damaged, simply send us a photo on WhatsApp within 48 hours of delivery and we will replace it free of charge.' },
  { q: 'Do you offer plant care consultations?', a: 'Yes! Our plant experts are available on WhatsApp to provide free plant care advice. We also offer in-person consultations at our nursery.' },
];

const contactInfo = [
  { icon: MapPin, title: 'Visit Us', content: 'Mourya Nursery, Sector 94, Bandh Road, Near Okhla Bird Sanctuary, Noida, UP', link: undefined },
  { icon: Mail, title: 'Email Us', content: 'mouryagreenworld@gmail.com', link: 'mailto:mouryagreenworld@gmail.com' },
  { icon: FaWhatsapp, title: 'WhatsApp', content: '+91 98712 17876', link: 'https://wa.me/919871217876' },
  { icon: Phone, title: 'Secondary Contact', content: '+91 99580 32648', link: 'tel:+919958032648' },
  { icon: Clock, title: 'Open Hours', content: 'Mon – Sun: 9:00 AM – 7:00 PM', link: undefined },
];

export default function Contact() {
  const { toast } = useToast();

  useEffect(() => {
    document.title = 'Contact Us — Mourya Green World';
  }, []);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  });

  const onSubmit = (data: ContactForm) => {
    toast({ title: 'Message sent!', description: 'We will get back to you within 24 hours.' });
    form.reset();
  };

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background pt-16 pb-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">Get in Touch</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have questions about plants or want to place an order? We are here to help!
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Contact Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {contactInfo.map((info, i) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              {info.link ? (
                <a href={info.link} target="_blank" rel="noopener noreferrer" className="block bg-card border border-card-border rounded-2xl p-5 text-center hover:shadow-md hover:border-primary/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary transition-colors">
                    <info.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-semibold text-sm text-foreground mb-1">{info.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{info.content}</p>
                </a>
              ) : (
                <div className="bg-card border border-card-border rounded-2xl p-5 text-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-semibold text-sm text-foreground mb-1">{info.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{info.content}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Form + Map */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <div className="bg-card border border-card-border rounded-2xl p-6">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input data-testid="input-name" placeholder="Your name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input data-testid="input-email" type="email" placeholder="your@email.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input data-testid="input-phone" type="tel" placeholder="+91 XXXXX XXXXX" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="subject" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-subject">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="order">Plant Order</SelectItem>
                        <SelectItem value="bulk">Bulk Order</SelectItem>
                        <SelectItem value="care">Plant Care Help</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        data-testid="input-message"
                        placeholder="Tell us how we can help..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button data-testid="button-submit-contact" type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                  Send Message
                </Button>
              </form>
            </Form>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">Or reach us on:</p>
              <a
                href="https://wa.me/919871217876"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-[#25D366] hover:underline"
              >
                <FaWhatsapp className="h-4 w-4" /> WhatsApp
              </a>
              <a
                href="https://instagram.com/mouryagreenworld"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <FaInstagram className="h-4 w-4" /> Instagram
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="flex flex-col gap-4">
            <div className="bg-card border border-card-border rounded-2xl overflow-hidden flex-1">
              <div className="p-4 border-b border-border">
                <p className="font-semibold text-foreground text-sm">Find Us Here</p>
                <p className="text-xs text-muted-foreground">Sector 94, Bandh Road, Near Okhla Bird Sanctuary, Noida</p>
              </div>
              <div className="h-72">
                <iframe
                  src="https://maps.google.com/maps?q=Okhla+Bird+Sanctuary+Noida+UP&output=embed&z=14"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mourya Green World location map"
                />
              </div>
            </div>
            <a
              href="https://wa.me/919871217876?text=Hi%2C%20I%20want%20to%20place%20an%20order!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#25D366] text-white font-semibold px-6 py-4 rounded-2xl hover:bg-[#1da851] transition-colors shadow-lg"
            >
              <FaWhatsapp className="h-6 w-6" />
              Order Directly on WhatsApp
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card border border-card-border rounded-2xl px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="font-medium text-foreground hover:text-primary hover:no-underline text-left py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </main>
  );
}
