import type { Word } from '../types';

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

// quality: 0 = forgot, 1 = knew
export function calculateNextReview(word: Word, quality: 0 | 1): Partial<Word> {
  if (quality === 0) {
    return {
      repetitions: 0,
      interval: 1,
      easeFactor: Math.max(1.3, word.easeFactor - 0.2),
      nextReview: daysFromNow(1),
      lastReview: new Date(),
    };
  }
  const newRepetitions = word.repetitions + 1;
  let interval: number;
  if (newRepetitions === 1) interval = 1;
  else if (newRepetitions === 2) interval = 6;
  else interval = Math.round(word.interval * word.easeFactor);
  // Cap at 365 days
  interval = Math.min(interval, 365);
  return {
    repetitions: newRepetitions,
    interval,
    easeFactor: Math.min(word.easeFactor + 0.1, 3.0),
    nextReview: daysFromNow(interval),
    lastReview: new Date(),
  };
}
