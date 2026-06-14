import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { usePublicData } from '@/contexts/AdminContext';

export function FloatingWhatsApp() {
  const { settings } = usePublicData();
  const [expanded, setExpanded] = useState(false);
  const waUrl = `https://wa.me/${settings.whatsappPrimary}?text=Hi%2C%20I%E2%80%99m%20interested%20in%20plants%20from%20Mourya%20Green%20World!`;

  return (
    <div className="fixed bottom-6 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-3 mb-16 md:mb-0">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-card-border p-4 max-w-[220px]"
          >
            <p className="text-xs font-semibold text-foreground mb-1">Chat with us</p>
            <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">Need help choosing a plant? We reply in minutes!</p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="floating-whatsapp"
              className="flex items-center gap-2 bg-[#25D366] text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#22c35e] transition-colors"
            >
              <FaWhatsapp className="h-3.5 w-3.5" />
              Start Chat
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setExpanded(v => !v)}
        aria-label="Chat on WhatsApp"
        className="relative w-14 h-14 rounded-full bg-[#25D366] shadow-xl flex items-center justify-center text-white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.8 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulse ring */}
        <motion.span
          className="absolute inset-0 rounded-full bg-[#25D366]"
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="h-6 w-6 relative z-10" />
            </motion.span>
          ) : (
            <motion.span key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <FaWhatsapp className="h-7 w-7 relative z-10" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
