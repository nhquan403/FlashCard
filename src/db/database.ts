import Dexie, { type Table } from 'dexie';
import type { Folder, Word, StudySession } from '../types';

export class AppDatabase extends Dexie {
  folders!: Table<Folder>;
  words!: Table<Word>;
  sessions!: Table<StudySession>;

  constructor() {
    super('FlashcardDB');
    this.version(1).stores({
      folders: '++id, name, createdAt',
      words: '++id, folderId, nextReview',
      sessions: '++id, folderId, date',
    });
    // v2: adds unindexed `pronunciation` field to words (no migration needed)
    this.version(2).stores({
      folders: '++id, name, createdAt',
      words: '++id, folderId, nextReview',
      sessions: '++id, folderId, date',
    });
  }
}

export const db = new AppDatabase();
