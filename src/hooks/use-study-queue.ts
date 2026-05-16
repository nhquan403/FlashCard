import { useState, useEffect, useCallback } from 'react';
import type { Word } from '../types';
import { getWordsByFolder, getWordsDueToday, getStrugglingWords, updateWordSRS, createSession } from '../db/queries';
import { calculateNextReview } from '../lib/srs';

export type StudyMode = 'due' | 'all' | 'struggling';
export type StudyPhase = 'studying' | 'complete';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getHintSeen(): boolean {
  try { return localStorage.getItem('hintSeen') === '1'; } catch { return false; }
}

function setHintSeenStorage() {
  try { localStorage.setItem('hintSeen', '1'); } catch { /* private mode */ }
}

export function useStudyQueue(folderId: number) {
  const [mode, setMode] = useState<StudyMode>('due');
  const [queue, setQueue] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [known, setKnown] = useState(0);
  const [forgot, setForgot] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [phase, setPhase] = useState<StudyPhase>('studying');
  const [loading, setLoading] = useState(true);
  const [hintSeen, setHintSeen] = useState(getHintSeen);

  const loadQueue = useCallback(async (modeOverride?: StudyMode) => {
    const activeMode = modeOverride ?? mode;
    setLoading(true);
    try {
      const words = activeMode === 'due'
        ? await getWordsDueToday(folderId)
        : activeMode === 'struggling'
          ? await getStrugglingWords(folderId)
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

  const handleSwipe = useCallback(async (quality: 0 | 1) => {
    if (!hintSeen) { setHintSeenStorage(); setHintSeen(true); }
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
  }, [hintSeen, queue, currentIndex, known, forgot, folderId]);

  const studyStruggling = useCallback(() => {
    setMode('struggling');
    loadQueue('struggling');
  }, [loadQueue]);

  return {
    mode, setMode, queue, currentIndex, known, forgot,
    isFlipped, setIsFlipped, phase, loading, hintSeen,
    loadQueue, handleSwipe, studyStruggling,
  };
}
