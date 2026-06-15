import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Leaf } from 'lucide-react';

const tabs = ['All', 'Nursery', 'Indoor Setup', 'Outdoor Gardens', 'Transformations'];

const galleryItems = [
  { id: 1, src: '/images/products/plant-1.png', color: 'bg-emerald-50', label: 'Lush Indoor Corner', tab: 'Indoor Setup' },
  { id: 2, src: '/images/products/plant-2.png', color: 'bg-pink-50', label: 'Flowering Garden', tab: 'Outdoor Gardens' },
  { id: 3, src: '/images/products/plant-3.png', color: 'bg-lime-50', label: 'Succulent Wall', tab: 'Nursery' },
  { id: 4, src: '/images/products/plant-4.png', color: 'bg-teal-50', label: 'Bonsai Collection', tab: 'Nursery' },
  { id: 5, src: '/images/products/plant-5.png', color: 'bg-green-50', label: 'Hanging Paradise', tab: 'Indoor Setup' },
  { id: 6, src: '/images/products/plant-6.png', color: 'bg-emerald-50', label: 'Lucky Corner', tab: 'Indoor Setup' },
  { id: 7, src: '/images/products/plant-7.png', color: 'bg-rose-50', label: 'Balcony Garden', tab: 'Outdoor Gardens' },
  { id: 8, src: '/images/products/plant-8.png', color: 'bg-teal-50', label: 'Nursery Rows', tab: 'Nursery' },
  { id: 9, src: '/images/products/plant-9.png', color: 'bg-green-50', label: 'Before & After', tab: 'Transformations' },
  { id: 10, src: '/images/products/plant-10.png', color: 'bg-emerald-100', label: 'Office Greenery', tab: 'Transformations' },
  { id: 11, src: '/images/products/plant-1.png', color: 'bg-pink-50', label: 'Seasonal Blooms', tab: 'Outdoor Gardens' },
  { id: 12, src: '/images/products/plant-2.png', color: 'bg-lime-50', label: 'Plant Wall Art', tab: 'Transformations' },
  { id: 13, src: '/images/products/plant-3.png', color: 'bg-teal-100', label: 'Desert Corner', tab: 'Indoor Setup' },
  { id: 14, src: '/images/products/plant-4.png', color: 'bg-green-100', label: 'Monstera Collection', tab: 'Nursery' },
  { id: 15, src: '/images/products/plant-5.png', color: 'bg-emerald-50', label: 'Vastu Corner', tab: 'Indoor Setup' },
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('All');
  const [selected, setSelected] = useState<typeof galleryItems[0] | null>(null);

  useEffect(() => {
    document.title = 'Gallery — Mourya Green World';
  }, []);

  const filtered = activeTab === 'All' ? galleryItems : galleryItems.filter(g => g.tab === activeTab);

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/8 to-background pt-14 pb-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Our Green World</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">Nursery Gallery</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A glimpse into our nursery, customer gardens, and plant collections
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map(tab => (
            <button
              key={tab}
              data-testid={`tab-gallery-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                  : 'border-border text-foreground/70 hover:border-primary/40 hover:text-primary bg-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        >
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => setSelected(item)}
                className="rounded-2xl aspect-square overflow-hidden cursor-pointer group relative shadow-sm hover:shadow-md transition-shadow"
                data-testid={`img-gallery-${item.id}`}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  style={{ transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.style.display = 'none';
                    if (t.parentElement) {
                      t.parentElement.classList.add(item.color);
                      const icon = document.createElement('div');
                      icon.className = 'w-full h-full flex items-center justify-center';
                      t.parentElement.appendChild(icon);
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-semibold drop-shadow">{item.label}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selected.src}
                alt={selected.label}
                className="w-full aspect-square object-cover"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = 'none';
                  if (t.parentElement) t.parentElement.className += ` ${selected.color} flex items-center justify-center`;
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="font-semibold text-white text-lg">{selected.label}</p>
                <p className="text-white/70 text-sm">{selected.tab}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
