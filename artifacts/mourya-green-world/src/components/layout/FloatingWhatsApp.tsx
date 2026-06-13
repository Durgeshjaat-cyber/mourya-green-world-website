import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { usePublicData } from '@/contexts/AdminContext';

export function FloatingWhatsApp() {
  const { settings } = usePublicData();
  const waUrl = `https://wa.me/${settings.whatsappPrimary}?text=Hi%2C%20I%E2%80%99m%20interested%20in%20plants%20from%20Mourya%20Green%20World!`;

  return (
    <motion.a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="floating-whatsapp"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] shadow-xl flex items-center justify-center text-white"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ opacity: 0.4 }}
      />
      <FaWhatsapp className="h-7 w-7 relative z-10" />
    </motion.a>
  );
}
