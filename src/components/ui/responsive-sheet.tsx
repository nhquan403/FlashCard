import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ResponsiveSheetProps {
  onClose: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}

export default function ResponsiveSheet({ onClose, ariaLabel, children }: ResponsiveSheetProps) {
  const prefersReduced = useReducedMotion();

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const mobileVariants = {
    hidden: { y: '100%', opacity: prefersReduced ? 0 : 1 },
    visible: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: prefersReduced ? 0 : 1 },
  };

  const desktopVariants = {
    hidden: { opacity: 0, scale: prefersReduced ? 1 : 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: prefersReduced ? 1 : 0.95 },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Mobile: bottom sheet */}
      <motion.div
        className="relative w-full sm:hidden bg-gray-900 rounded-t-3xl border-t border-gray-700 max-h-[90dvh] overflow-y-auto pb-[env(safe-area-inset-bottom,0px)]"
        variants={mobileVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        role="dialog"
        aria-label={ariaLabel}
      >
        {/* Drag handle pill (decorative) */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>
        {children}
      </motion.div>

      {/* Desktop: centered modal */}
      <motion.div
        className="relative hidden sm:block w-full max-w-lg bg-gray-900 rounded-2xl border border-gray-700 max-h-[calc(100dvh-4rem)] overflow-y-auto"
        variants={desktopVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-label={ariaLabel}
      >
        {children}
      </motion.div>
    </div>
  );
}
