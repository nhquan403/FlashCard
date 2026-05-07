import { db } from './database';
import type { Word } from '../types';

export async function getWordsByFolder(folderId: number): Promise<Word[]> {
  return db.words.where('folderId').equals(folderId).toArray();
}

export async function getWordsDueToday(folderId: number): Promise<Word[]> {
  const now = new Date();
  const words = await db.words.where('folderId').equals(folderId).toArray();
  return words.filter((w) => w.nextReview <= now);
}

export async function createWord(
  folderId: number,
  word: string,
  description: string,
  pronunciation?: string
): Promise<number> {
  return db.words.add({
    folderId,
    word,
    description,
    ...(pronunciation ? { pronunciation } : {}),
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: new Date(),
  } as Word) as Promise<number>;
}

export async function updateWord(
  id: number,
  patch: Partial<Pick<Word, 'word' | 'description' | 'pronunciation'>>
): Promise<void> {
  await db.words.update(id, patch);
}

export async function bulkCreateWords(
  folderId: number,
  items: Array<{ word: string; description: string; pronunciation?: string }>
): Promise<void> {
  try {
    await db.transaction('rw', db.words, async () => {
      const records: Word[] = items.map((item) => ({
        folderId,
        word: item.word,
        description: item.description,
        ...(item.pronunciation ? { pronunciation: item.pronunciation } : {}),
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        nextReview: new Date(),
      }));
      await db.words.bulkAdd(records);
    });
  } catch (err) {
    throw new Error(`bulkCreateWords failed for folderId=${folderId}: ${(err as Error).message}`);
  }
}

export async function updateWordSRS(id: number, patch: Partial<Word>): Promise<void> {
  await db.words.update(id, patch);
}

export async function deleteWord(id: number): Promise<void> {
  await db.words.delete(id);
}
