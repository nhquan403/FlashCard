import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';

export const useWords = (folderId: number) =>
  useLiveQuery(() => db.words.where('folderId').equals(folderId).toArray(), [folderId]);
