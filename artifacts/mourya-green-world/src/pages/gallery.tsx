import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const tabs = ['All', 'Nursery', 'Indoor Setup', 'Outdoor Gardens', 'Transformations'];

const galleryItems = [
  { id: 1, emoji: '🌿', color: 'bg-emerald-100', label: 'Lush Indoor Corner', tab: 'Indoor Setup' },
  { id: 2, emoji: '🌸', color: 'bg-pink-50', label: 'Flowering Garden', tab: 'Outdoor Gardens' },
  { id: 3, emoji: '🌵', color: 'bg-lime-100', label: 'Succulent Wall', tab: 'Nursery' },
  { id: 4, emoji: '🌳', color: 'bg-teal-100', label: 'Bonsai Collection', tab: 'Nursery' },
  { id: 5, emoji: '🪴', color: 'bg-green-100', label: 'Hanging Paradise', tab: 'Indoor Setup' },
  { id: 6, emoji: '🍀', color: 'bg-emerald-50', label: 'Lucky Corner', tab: 'Indoor Setup' },
  { id: 7, emoji: '🌺', color: 'bg-rose-50', label: 'Balcony Garden', tab: 'Outdoor Gardens' },
  { id: 8, emoji: '🌱', color: 'bg-teal-50', label: 'Nursery Rows', tab: 'Nursery' },
  { id: 9, emoji: '🍃', color: 'bg-green-50', label: 'Before & After', tab: 'Transformations' },
  { id: 10, emoji: '🌿', color: 'bg-emerald-200', label: 'Office Greenery', tab: 'Transformations' },
  { id: 11, emoji: '🌸', color: 'bg-pink-100', label: 'Seasonal Blooms', tab: 'Outdoor Gardens' },
  { id: 12, emoji: '🪴', color: 'bg-lime-50', label: 'Plant Wall Art', tab: 'Transformations' },
  { id: 13, emoji: '🌵', color: 'bg-teal-200', label: 'Desert Corner', tab: 'Indoor Setup' },
  { id: 14, emoji: '🌳', color: 'bg-green-200', label: 'Monstera Collection', tab: 'Nursery' },
  { id: 15, emoji: '🍀', color: 'bg-emerald-100', label: 'Vastu Corner', tab: 'Indoor Setup' },
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
      <section className="bg-gradient-to-b from-primary/10 to-background pt-16 pb-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">Our Gallery</h1>
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
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-foreground hover:border-primary hover:text-primary'
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
                className={`${item.color} rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition-shadow group`}
                data-testid={`img-gallery-${item.id}`}
              >
                <span className="text-5xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                <span className="text-xs text-foreground/60 font-medium px-2 text-center">{item.label}</span>
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
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className={`${selected.color} rounded-3xl p-12 flex flex-col items-center gap-4 max-w-sm w-full`}
              onClick={e => e.stopPropagation()}
            >
              <span className="text-[120px] leading-none">{selected.emoji}</span>
              <p className="font-semibold text-foreground text-lg text-center">{selected.label}</p>
              <span className="text-sm text-muted-foreground">{selected.tab}</span>
              <button
                onClick={() => setSelected(null)}
                className="mt-2 p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
