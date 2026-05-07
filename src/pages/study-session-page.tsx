import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { Word } from '../types';
import { getWordsByFolder, getWordsDueToday, updateWordSRS, createSession } from '../db/queries';
import { calculateNextReview } from '../lib/srs';
import FlipCard from '../components/flashcard/flip-card';
import SwipeCard from '../components/flashcard/swipe-card';
import SessionComplete from '../components/flashcard/session-complete';

type Mode = 'due' | 'all';
type Phase = 'studying' | 'complete';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getHintSeen(): boolean {
  try {
    return localStorage.getItem('hintSeen') === '1';
  } catch {
    return false;
  }
}

function setHintSeenStorage() {
  try {
    localStorage.setItem('hintSeen', '1');
  } catch {
    // silently ignore private mode
  }
}

export default function StudySessionPage() {
  const { folderId: folderIdParam } = useParams();
  const navigate = useNavigate();
  const folderId = parseInt(folderIdParam!, 10);

  const [mode, setMode] = useState<Mode>('due');
  const [queue, setQueue] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [known, setKnown] = useState(0);
  const [forgot, setForgot] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [phase, setPhase] = useState<Phase>('studying');
  const [loading, setLoading] = useState(true);
  const [hintSeen, setHintSeen] = useState(getHintSeen);

  const loadQueue = useCallback(async () => {
    setLoading(true);
    try {
      const words = mode === 'due'
        ? await getWordsDueToday(folderId)
        : await getWordsByFolder(folderId);
      setQueue(shuffle(words));
      setCurrentIndex(0);
      setKnown(0);
      setForgot(0);
      setIsFlipped(false);
      setPhase('studying');
    } finally {
      setLoading(false);
    }
  }, [folderId, mode]);

  useEffect(() => { loadQueue(); }, [loadQueue]);

  async function handleSwipe(quality: 0 | 1) {
    if (!hintSeen) {
      setHintSeenStorage();
      setHintSeen(true);
    }

    const card = queue[currentIndex];
    const patch = calculateNextReview(card, quality);
    await updateWordSRS(card.id!, patch);

    const newKnown = known + (quality === 1 ? 1 : 0);
    const newForgot = forgot + (quality === 0 ? 1 : 0);

    if (currentIndex + 1 >= queue.length) {
      await createSession(folderId, newKnown, newForgot);
      setKnown(newKnown);
      setForgot(newForgot);
      setPhase('complete');
    } else {
      setKnown(newKnown);
      setForgot(newForgot);
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  }

  if (phase === 'complete') {
    return (
      <SessionComplete
        known={known}
        forgot={forgot}
        onRestart={loadQueue}
        onBack={() => navigate(`/folder/${folderId}`)}
      />
    );
  }

  const card = queue[currentIndex];
  const remaining = queue.length - currentIndex;

  return (
    <div className="min-h-[100dvh] flex flex-col px-4 py-4 sm:py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/folder/${folderId}`)}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-100 transition-colors touch-manipulation"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex rounded-xl overflow-hidden border border-gray-700 w-full sm:w-auto ml-4 sm:ml-0">
          <button
            onClick={() => setMode('due')}
            className={`flex-1 sm:flex-none px-3 min-h-[40px] text-sm font-medium transition-colors touch-manipulation ${
              mode === 'due' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-100'
            }`}
          >
            Due Today
          </button>
          <button
            onClick={() => setMode('all')}
            className={`flex-1 sm:flex-none px-3 min-h-[40px] text-sm font-medium transition-colors touch-manipulation ${
              mode === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-100'
            }`}
          >
            All Words
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">Loading...</div>
      ) : queue.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <p className="text-6xl">🎉</p>
          <p className="text-xl font-semibold text-gray-100">Nothing due today!</p>
          <p className="text-base text-gray-400">All caught up.</p>
          <button
            onClick={() => setMode('all')}
            className="mt-2 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors touch-manipulation min-h-[48px]"
          >
            Study All
          </button>
        </div>
      ) : (
        <>
          <div className="text-center text-gray-400 text-sm sm:text-base mb-4">
            {remaining} / {queue.length} remaining
          </div>

          <div className="flex-1 flex flex-col justify-center gap-6">
            <SwipeCard card={card} onSwipe={handleSwipe}>
              <FlipCard
                word={card.word}
                description={card.description}
                isFlipped={isFlipped}
                onClick={() => setIsFlipped(!isFlipped)}
                pronunciation={card.pronunciation}
              />
            </SwipeCard>

            {/* First-time swipe hint */}
            {currentIndex === 0 && !hintSeen && (
              <p className="text-xs text-gray-500 text-center -mt-2">
                Swipe right if you knew it · Swipe left if you forgot
              </p>
            )}

            {/* Fallback buttons */}
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleSwipe(0)}
                className="flex-1 h-12 rounded-2xl bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 text-red-400 font-semibold transition-colors touch-manipulation active:scale-95 transition-transform"
              >
                ← Forgot
              </button>
              <button
                onClick={() => handleSwipe(1)}
                className="flex-1 h-12 rounded-2xl bg-green-600/20 hover:bg-green-600/40 border border-green-600/50 text-green-400 font-semibold transition-colors touch-manipulation active:scale-95 transition-transform"
              >
                Knew →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
