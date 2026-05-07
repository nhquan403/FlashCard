import { db } from './database';
import type { StudySession } from '../types';

export async function createSession(
  folderId: number,
  knownCount: number,
  forgotCount: number
): Promise<number> {
  return db.sessions.add({
    folderId,
    date: new Date(),
    totalCards: knownCount + forgotCount,
    knownCount,
    forgotCount,
  } as StudySession) as Promise<number>;
}

export async function getSessionsByFolder(folderId: number): Promise<StudySession[]> {
  return db.sessions.where('folderId').equals(folderId).sortBy('date');
}

export async function getRecentSessions(days: number): Promise<StudySession[]> {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  const all = await db.sessions.orderBy('date').toArray();
  return all.filter((s) => s.date >= daysAgo);
}
