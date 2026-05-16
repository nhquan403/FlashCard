import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStudyQueue } from '../hooks/use-study-queue';
import type { StudyMode } from '../hooks/use-study-queue';
import FlipCard from '../components/flashcard/flip-card';
import SwipeCard from '../components/flashcard/swipe-card';
import SessionComplete from '../components/flashcard/session-complete';

const TABS: { id: StudyMode; label: string }[] = [
  { id: 'due', label: 'Due Today' },
  { id: 'all', label: 'All Words' },
  { id: 'struggling', label: 'Struggling' },
];

export default function StudySessionPage() {
  const { folderId: folderIdParam } = useParams();
  const navigate = useNavigate();
  const folderId = parseInt(folderIdParam!, 10);

  const {
    mode, setMode, queue, currentIndex, known, forgot,
    isFlipped, setIsFlipped, phase, loading, hintSeen,
    loadQueue, handleSwipe, studyStruggling,
  } = useStudyQueue(isNaN(folderId) ? 0 : folderId);

  if (isNaN(folderId)) {
    navigate('/');
    return null;
  }

  if (phase === 'complete') {
    return (
      <SessionComplete
        known={known}
        forgot={forgot}
        onRestart={loadQueue}
        onBack={() => navigate(`/folder/${folderId}`)}
        onStudyStruggling={forgot > 0 ? studyStruggling : undefined}
      />
    );
  }

  const card = queue[currentIndex];
  const remaining = queue.length - currentIndex;

  return (
    <div className="min-h-[100dvh] flex flex-col px-4 py-4 sm:py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(`/folder/${folderId}`)}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-100 transition-colors touch-manipulation flex-shrink-0"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex rounded-xl overflow-hidden border border-gray-700 flex-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className={`flex-1 px-2 min-h-[40px] text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                mode === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">Loading...</div>
      ) : queue.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <p className="text-6xl">{mode === 'struggling' ? '⚡' : '🎉'}</p>
          <p className="text-xl font-semibold text-gray-100">
            {mode === 'struggling' ? 'No struggling words!' : 'Nothing due today!'}
          </p>
          <p className="text-base text-gray-400">
            {mode === 'struggling' ? 'Keep it up!' : 'All caught up.'}
          </p>
          {mode !== 'all' && (
            <button
              onClick={() => setMode('all')}
              className="mt-2 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors touch-manipulation min-h-[48px]"
            >
              Study All
            </button>
          )}
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

            {currentIndex === 0 && !hintSeen && (
              <p className="text-xs text-gray-500 text-center -mt-2">
                Swipe right if you knew it · Swipe left if you forgot
              </p>
            )}

            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleSwipe(0)}
                className="flex-1 h-12 rounded-2xl bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 text-red-400 font-semibold transition-colors touch-manipulation active:scale-95"
              >
                ← Forgot
              </button>
              <button
                onClick={() => handleSwipe(1)}
                className="flex-1 h-12 rounded-2xl bg-green-600/20 hover:bg-green-600/40 border border-green-600/50 text-green-400 font-semibold transition-colors touch-manipulation active:scale-95"
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
