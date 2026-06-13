import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaWhatsapp } from 'react-icons/fa';
import { Leaf, Truck, Shovel, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';

type FormType = 'product' | 'bulk' | 'landscaping';

const formTypes = [
  {
    id: 'product' as FormType,
    icon: Leaf,
    label: 'Product Inquiry',
    desc: 'Ask about a specific plant or pot',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    activeColor: 'bg-primary border-primary text-white',
  },
  {
    id: 'bulk' as FormType,
    icon: Truck,
    label: 'Bulk Order',
    desc: 'Order 10+ plants for office or events',
    color: 'bg-teal-50 border-teal-200 text-teal-700',
    activeColor: 'bg-primary border-primary text-white',
  },
  {
    id: 'landscaping' as FormType,
    icon: Shovel,
    label: 'Landscaping Request',
    desc: 'Get a quote for garden design & setup',
    color: 'bg-lime-50 border-lime-200 text-lime-700',
    activeColor: 'bg-primary border-primary text-white',
  },
];

const budgetOptions = {
  product: ['Under ₹500', '₹500 – ₹1,000', '₹1,000 – ₹2,000', '₹2,000 – ₹5,000', 'Above ₹5,000'],
  bulk: ['Under ₹5,000', '₹5,000 – ₹15,000', '₹15,000 – ₹30,000', '₹30,000 – ₹75,000', 'Above ₹75,000'],
  landscaping: ['Under ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000', '₹50,000 – ₹1,00,000', 'Above ₹1,00,000'],
};

const plantOptions = {
  product: ['Indoor Plants', 'Outdoor Plants', 'Air Purifying Plants', 'Lucky Plants', 'Flowering Plants', 'Succulents', 'Hanging Plants', 'Bonsai Plants', 'Pots & Planters', 'Other / Not sure'],
  bulk: ['Indoor Office Plants', 'Outdoor Garden Plants', 'Mixed Assortment', 'Event Decoration Plants', 'Air Purifying Plants', 'Lucky / Vastu Plants', 'Flowering Plants', 'Other / Not sure'],
  landscaping: ['Balcony Garden', 'Terrace Garden', 'Front Yard / Lawn', 'Full Home Garden', 'Office Campus Garden', 'Society / Apartment Garden', 'Vertical Garden / Wall', 'Other'],
};

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number').max(15),
  location: z.string().min(3, 'Please enter your location in Noida / NCR'),
  plantRequirement: z.string().min(1, 'Please select a plant / service type'),
  quantity: z.string().min(1, 'Please specify the quantity or area'),
  budget: z.string().min(1, 'Please select your budget range'),
  message: z.string().optional(),
});

type InquiryForm = z.infer<typeof inquirySchema>;

const WA_NUMBER = '919876543210';

function buildWhatsAppMessage(type: FormType, data: InquiryForm): string {
  const typeLabels: Record<FormType, string> = {
    product: 'Product Inquiry',
    bulk: 'Bulk Order Request',
    landscaping: 'Landscaping Request',
  };

  const lines = [
    `*${typeLabels[type]} — Mourya Green World*`,
    '',
    `*Name:* ${data.name}`,
    `*Phone:* ${data.phone}`,
    `*Location:* ${data.location}`,
    `*Requirement:* ${data.plantRequirement}`,
    `*Quantity / Area:* ${data.quantity}`,
    `*Budget:* ${data.budget}`,
    data.message ? `*Message:* ${data.message}` : '',
    '',
    '_Please confirm availability and share pricing._',
  ].filter(Boolean);

  return encodeURIComponent(lines.join('\n'));
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Inquiry() {
  const [activeType, setActiveType] = useState<FormType>('product');
  const [submitted, setSubmitted] = useState(false);
  const [waUrl, setWaUrl] = useState('');

  useEffect(() => {
    document.title = 'Inquiry & Bulk Orders — Mourya Green World';
  }, []);

  const form = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: '',
      phone: '',
      location: '',
      plantRequirement: '',
      quantity: '',
      budget: '',
      message: '',
    },
  });

  // Reset form when switching type
  useEffect(() => {
    form.reset({
      name: form.getValues('name'),
      phone: form.getValues('phone'),
      location: form.getValues('location'),
      plantRequirement: '',
      quantity: '',
      budget: '',
      message: form.getValues('message'),
    });
    setSubmitted(false);
  }, [activeType]);

  const onSubmit = (data: InquiryForm) => {
    const msg = buildWhatsAppMessage(activeType, data);
    const url = `https://wa.me/${WA_NUMBER}?text=${msg}`;
    setWaUrl(url);
    setSubmitted(true);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const quantityLabel = activeType === 'landscaping' ? 'Area / Size (sq ft or description)' : 'Quantity Required';
  const quantityPlaceholder =
    activeType === 'product'
      ? 'e.g. 2 plants'
      : activeType === 'bulk'
      ? 'e.g. 50 plants'
      : 'e.g. 200 sq ft terrace';

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background pt-16 pb-10">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">Direct WhatsApp Ordering</Badge>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Place Your Order or Inquiry
            </motion.h1>
            <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed">
              Fill in the details below and your message will be sent directly to our WhatsApp. We respond within 2 hours.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-2xl">
        {/* Type Selector */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
        >
          {formTypes.map(ft => (
            <motion.button
              key={ft.id}
              variants={fadeUp}
              data-testid={`tab-inquiry-${ft.id}`}
              onClick={() => setActiveType(ft.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
                activeType === ft.id ? ft.activeColor : `${ft.color} hover:border-primary/50`
              }`}
            >
              <ft.icon className="h-6 w-6" />
              <span className="font-semibold text-sm">{ft.label}</span>
              <span className={`text-xs leading-tight ${activeType === ft.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                {ft.desc}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Success State */}
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-card-border rounded-3xl p-10 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#25D366]/10 flex items-center justify-center mx-auto mb-6">
              <FaWhatsapp className="h-10 w-10 text-[#25D366]" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">WhatsApp Opened!</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your inquiry has been prepared and WhatsApp should have opened automatically. If not, click the button below.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1da851] transition-colors shadow-lg"
              >
                <FaWhatsapp className="h-5 w-5" />
                Open WhatsApp Again
              </a>
              <button
                onClick={() => { setSubmitted(false); form.reset(); }}
                className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-medium px-6 py-3 rounded-xl hover:bg-muted transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary" />
              We typically respond within 2 hours on WhatsApp
            </div>
          </motion.div>
        ) : (
          /* Form */
          <motion.div
            key={activeType}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-card-border rounded-3xl p-6 md:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              {formTypes.find(f => f.id === activeType) && (() => {
                const ft = formTypes.find(f => f.id === activeType)!;
                return (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ft.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">{ft.label}</h2>
                      <p className="text-xs text-muted-foreground">{ft.desc}</p>
                    </div>
                  </>
                );
              })()}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-inquiry-name"
                            placeholder="Your full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-inquiry-phone"
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Location *</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-inquiry-location"
                          placeholder="e.g. Sector 62, Noida / Gurgaon / Delhi"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Plant Requirement */}
                <FormField
                  control={form.control}
                  name="plantRequirement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {activeType === 'landscaping' ? 'Type of Garden / Project *' : 'Plant / Product Type *'}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-inquiry-plant">
                            <SelectValue placeholder="Select an option..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {plantOptions[activeType].map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quantity + Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{quantityLabel} *</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-inquiry-quantity"
                            placeholder={quantityPlaceholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Range *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-inquiry-budget">
                              <SelectValue placeholder="Select budget..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {budgetOptions[activeType].map(opt => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Additional Details
                        <span className="ml-1 text-muted-foreground font-normal text-xs">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          data-testid="input-inquiry-message"
                          placeholder={
                            activeType === 'product'
                              ? 'Any specific variety, pot size, or other details...'
                              : activeType === 'bulk'
                              ? 'Type of space (office / event / society), any specific requirements...'
                              : 'Describe your garden vision, existing space, or any specific plants you want...'
                          }
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <div className="pt-2">
                  <Button
                    data-testid="button-submit-inquiry"
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#1da851] text-white h-13 text-base font-semibold rounded-xl shadow-lg"
                    size="lg"
                  >
                    <FaWhatsapp className="h-5 w-5 mr-2" />
                    Send Inquiry via WhatsApp
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Clicking will open WhatsApp with your details pre-filled · We respond within 2 hours
                  </p>
                </div>
              </form>
            </Form>
          </motion.div>
        )}

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: '⚡', title: '2-Hour Response', desc: 'Fast replies on WhatsApp' },
            { icon: '💰', title: 'Best Prices', desc: 'Competitive bulk pricing' },
            { icon: '🚚', title: 'Free Delivery', desc: 'Within Noida' },
          ].map(badge => (
            <div key={badge.title} className="text-center p-4 bg-muted/30 rounded-2xl">
              <span className="text-2xl block mb-2">{badge.icon}</span>
              <p className="font-medium text-sm text-foreground">{badge.title}</p>
              <p className="text-xs text-muted-foreground">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
