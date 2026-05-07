import { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Word } from '../../types';
import SwipeHintOverlay from './swipe-hint-overlay';

interface SwipeCardProps {
  card: Word;
  onSwipe: (quality: 0 | 1) => void;
  children: React.ReactNode;
}

export default function SwipeCard({ card, onSwipe, children }: SwipeCardProps) {
  const [dragX, setDragX] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [exitDir, setExitDir] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  function handleDrag(_: unknown, info: { offset: { x: number } }) {
    setDragX(info.offset.x);
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    setDragX(0);
    const w = containerRef.current?.offsetWidth ?? 320;
    const threshold = w * 0.3;

    if (info.offset.x < -threshold) {
      setExitDir(-1);
      setExiting(true);
      if ('vibrate' in navigator) navigator.vibrate(10);
      setTimeout(() => {
        setExiting(false);
        onSwipe(0);
      }, 350);
    } else if (info.offset.x > threshold) {
      setExitDir(1);
      setExiting(true);
      if ('vibrate' in navigator) navigator.vibrate(10);
      setTimeout(() => {
        setExiting(false);
        onSwipe(1);
      }, 350);
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={containerRef}
        key={card.id}
        className="relative w-full touch-manipulation cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={
          exiting
            ? { x: exitDir * 500, rotate: reduced ? 0 : exitDir * 30, opacity: 0 }
            : { x: 0, rotate: 0, opacity: 1 }
        }
        initial={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
        <SwipeHintOverlay dragX={dragX} />
      </motion.div>
    </AnimatePresence>
  );
}
