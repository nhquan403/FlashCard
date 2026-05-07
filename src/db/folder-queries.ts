import { db } from './database';
import type { Folder } from '../types';

export async function getFolders(): Promise<Folder[]> {
  return db.folders.orderBy('createdAt').toArray();
}

export async function createFolder(name: string, description?: string): Promise<number> {
  return db.folders.add({
    name,
    description,
    createdAt: new Date(),
  } as Folder) as Promise<number>;
}

export async function updateFolder(
  id: number,
  patch: Partial<Pick<Folder, 'name' | 'description'>>
): Promise<void> {
  await db.folders.update(id, patch);
}

export async function deleteFolder(id: number): Promise<void> {
  await db.transaction('rw', db.folders, db.words, async () => {
    await db.words.where('folderId').equals(id).delete();
    await db.folders.delete(id);
  });
}
