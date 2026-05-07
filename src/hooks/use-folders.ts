import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';

export const useFolders = () => useLiveQuery(() => db.folders.toArray(), []);

export const useWordCount = (folderId: number) =>
  useLiveQuery(() => db.words.where('folderId').equals(folderId).count(), [folderId]);
