import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Users, Award, Heart } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Plant Varieties' },
  { value: '10,000+', label: 'Happy Customers' },
  { value: '5 Years', label: 'Of Excellence' },
  { value: '100%', label: 'Expert Advice' },
];

const values = [
  { icon: Leaf, title: 'Quality First', desc: 'Every plant in our nursery is hand-selected, healthy, and nurtured to perfection before it reaches your door.' },
  { icon: Heart, title: 'Customer Care', desc: 'We are not just selling plants — we are building lasting relationships with every plant parent we serve.' },
  { icon: Award, title: 'Sustainability', desc: 'We practice sustainable growing methods, using organic inputs and eco-friendly packaging wherever possible.' },
  { icon: Users, title: 'Community', desc: 'From Noida to the entire NCR, we are proud to be the plant partner of thousands of families and offices.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  useEffect(() => {
    document.title = 'About Us — Mourya Green World';
  }, []);

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Mourya Green World
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Mourya Green World is a trusted plant nursery in Noida helping people create greener homes, offices, and gardens through healthy and high-quality plants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-serif text-4xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-white/70 text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  What started as a small passion project has grown into one of Noida's most trusted plant nurseries. Mourya Green World was founded with a simple mission: to make beautiful, healthy plants accessible to every home and office in the NCR region.
                </p>
                <p>
                  Located near the Okhla Bird Sanctuary in Sector 94, Noida, our nursery is nestled in one of the greenest pockets of the city. Every day, our team lovingly tends to over 500 plant varieties — from air-purifying indoor plants to rare bonsai specimens.
                </p>
                <p>
                  We believe that every space deserves a touch of nature. Whether you are a first-time plant parent or an experienced gardener, we are here to guide you every step of the way — from choosing the right plant to keeping it thriving for years.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                '/images/products/plant-1.png',
                '/images/products/plant-2.png',
                '/images/products/plant-3.png',
                '/images/products/plant-4.png',
              ].map((src, i) => (
                <div key={i} className={`aspect-square rounded-2xl overflow-hidden ${['bg-emerald-50', 'bg-teal-50', 'bg-green-50', 'bg-lime-50'][i]}`}>
                  <img
                    src={src}
                    alt={`Our nursery plant ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Our Values</h2>
            <p className="text-muted-foreground">What makes us different</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-6 text-center">Visit Our Nursery</h2>
          <div className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border">
              <p className="font-semibold text-foreground">Mourya Nursery</p>
              <p className="text-muted-foreground text-sm">Sector 94, Bandh Road, Near Okhla Bird Sanctuary, Noida, Uttar Pradesh</p>
              <p className="text-sm text-primary font-medium mt-1">Open daily: 9:00 AM – 7:00 PM</p>
            </div>
            <div className="aspect-video bg-green-50 flex items-center justify-center">
              <iframe
                src="https://maps.google.com/maps?q=Okhla+Bird+Sanctuary+Noida+UP&output=embed&z=14"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mourya Green World location"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
