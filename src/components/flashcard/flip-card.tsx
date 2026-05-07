import { useReducedMotion } from 'framer-motion';
import { speak } from '../../lib/tts';

interface FlipCardProps {
  word: string;
  description: string;
  isFlipped: boolean;
  onClick: () => void;
  pronunciation?: string;
}

export default function FlipCard({ word, description, isFlipped, onClick, pronunciation }: FlipCardProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const hasTTS = typeof window !== 'undefined' && !!window.speechSynthesis;

  return (
    <div
      className="relative w-full cursor-pointer h-[clamp(220px,50vw+80px,340px)] [perspective:1000px]"
      onClick={onClick}
    >
      <div
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{
          transition: prefersReduced ? 'opacity 200ms' : 'transform 500ms',
          transform: isFlipped && !prefersReduced ? 'rotateY(180deg)' : 'rotateY(0deg)',
          opacity: prefersReduced && isFlipped ? 0 : 1,
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl flex flex-col items-center justify-center [backface-visibility:hidden]"
        >
          <span className="text-[clamp(1.4rem,5vw,2rem)] font-bold text-gray-100 leading-tight px-4 text-center">
            {word}
          </span>
          {pronunciation && (
            <span className="text-gray-400 text-sm font-mono mt-1">{pronunciation}</span>
          )}
          {hasTTS && (
            <div className="flex gap-3 mt-3">
              <button
                onClick={(e) => { e.stopPropagation(); speak(word, 1.0); }}
                className="p-1.5 text-gray-400 hover:text-gray-100 transition-colors"
                aria-label="Speak normal speed"
                title="Normal speed"
              >
                🔊
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); speak(word, 0.4); }}
                className="p-1.5 text-gray-400 hover:text-gray-100 transition-colors"
                aria-label="Speak slow speed"
                title="Slow speed"
              >
                🐢
              </button>
            </div>
          )}
          {!isFlipped && (
            <span className="text-gray-500 text-sm mt-4">Tap to flip</span>
          )}
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl flex items-center justify-center px-6 [backface-visibility:hidden]"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <span className="text-[clamp(1rem,3.5vw,1.25rem)] text-gray-200 text-center">
            {description}
          </span>
        </div>
      </div>
    </div>
  );
}
