import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeHintOverlayProps {
  dragX: number;
}

export default function SwipeHintOverlay({ dragX }: SwipeHintOverlayProps) {
  const divisor = typeof window !== 'undefined' ? window.innerWidth * 0.25 : 150;
  const forgotOpacity = dragX < 0 ? Math.min(Math.abs(dragX) / divisor, 0.7) : 0;
  const knewOpacity = dragX > 0 ? Math.min(dragX / divisor, 0.7) : 0;

  // Chevron affordance: visible at low opacity, dims toward the active side
  const leftChevronOpacity = Math.max(0.1, 0.4 - Math.abs(dragX) / 400);
  const rightChevronOpacity = Math.max(0.1, 0.4 - Math.abs(dragX) / 400);

  return (
    <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden">
      {/* Static chevron affordances */}
      <div
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
        style={{ opacity: leftChevronOpacity }}
      >
        <ChevronLeft size={28} strokeWidth={2.5} />
      </div>
      <div
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
        style={{ opacity: rightChevronOpacity }}
      >
        <ChevronRight size={28} strokeWidth={2.5} />
      </div>

      {/* Forgot overlay - left swipe */}
      <div
        className="absolute inset-0 rounded-3xl flex items-center justify-start pl-8"
        style={{
          backgroundColor: `rgba(239, 68, 68, ${forgotOpacity})`,
          opacity: forgotOpacity > 0 ? 1 : 0,
        }}
      >
        <span
          className="text-white font-bold text-xl tracking-wider -rotate-12"
          style={{ opacity: forgotOpacity / 0.7 }}
        >
          FORGOT
        </span>
      </div>

      {/* Knew overlay - right swipe */}
      <div
        className="absolute inset-0 rounded-3xl flex items-center justify-end pr-8"
        style={{
          backgroundColor: `rgba(34, 197, 94, ${knewOpacity})`,
          opacity: knewOpacity > 0 ? 1 : 0,
        }}
      >
        <span
          className="text-white font-bold text-xl tracking-wider rotate-12"
          style={{ opacity: knewOpacity / 0.7 }}
        >
          KNEW
        </span>
      </div>
    </div>
  );
}
