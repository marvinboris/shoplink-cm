'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  showHandle?: boolean;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
  showHandle = true,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={onClose}
            style={{ marginTop: 'env(safe-area-inset-top)' }}
          />
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-[60] rounded-t-[24px] bg-surface flex flex-col',
              className
            )}
            style={{ maxHeight: '90vh', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            {showHandle && (
              <div
                className="flex justify-center py-3 flex-shrink-0 cursor-pointer"
                onClick={onClose}
              >
                <div className="h-1 w-12 rounded-full bg-border" />
              </div>
            )}
            {title && (
              <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0">
                <h2 className="text-lg font-display font-bold text-text-1">{title}</h2>
              </div>
            )}
            <div className="px-5 overflow-y-auto flex-1 min-h-0">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
