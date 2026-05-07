import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Folder } from '../types';

export interface DailyActivity {
  date: string;
  known: number;
  forgot: number;
}

export interface FolderStats {
  folder: Folder;
  total: number;
  known: number;
  pct: number;
}

export interface OverallStats {
  totalWords: number;
  mastered: number;
  streak: number;
  todayDue: number;
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function computeStreak(sessionDates: string[]): number {
  if (sessionDates.length === 0) return 0;
  const unique = Array.from(new Set(sessionDates)).sort().reverse();
  const today = toDateStr(new Date());
  const yesterday = toDateStr(new Date(Date.now() - 86400000));
  if (unique[0] !== today && unique[0] !== yesterday) return 0;

  let streak = 0;
  let current = new Date(unique[0]);
  for (const d of unique) {
    if (toDateStr(current) === d) {
      streak++;
      current = new Date(current.getTime() - 86400000);
    } else {
      break;
    }
  }
  return streak;
}

function computeDailyActivity(
  sessions: { date: Date; knownCount: number; forgotCount: number }[]
): DailyActivity[] {
  const today = new Date();
  const result: DailyActivity[] = [];

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = toDateStr(d);
    const daySessions = sessions.filter((s) => toDateStr(new Date(s.date)) === dateStr);
    result.push({
      date: dateStr,
      known: daySessions.reduce((acc, s) => acc + s.knownCount, 0),
      forgot: daySessions.reduce((acc, s) => acc + s.forgotCount, 0),
    });
  }
  return result;
}

export function useStats() {
  const data = useLiveQuery(async () => {
    const [words, sessions, folders] = await Promise.all([
      db.words.toArray(),
      db.sessions.toArray(),
      db.folders.toArray(),
    ]);

    const now = new Date();
    const totalWords = words.length;
    const mastered = words.filter((w) => w.interval >= 21).length;
    const todayDue = words.filter((w) => new Date(w.nextReview) <= now).length;

    const sessionDates = sessions.map((s) => toDateStr(new Date(s.date)));
    const streak = computeStreak(sessionDates);

    const overall: OverallStats = { totalWords, mastered, streak, todayDue };
    const dailyActivity = computeDailyActivity(sessions);

    const folderStats: FolderStats[] = folders.map((folder) => {
      const folderWords = words.filter((w) => w.folderId === folder.id);
      const total = folderWords.length;
      const known = folderWords.filter((w) => w.repetitions > 0).length;
      const pct = total > 0 ? Math.round((known / total) * 100) : 0;
      return { folder, total, known, pct };
    });

    return { overall, folderStats, dailyActivity };
  }, []);

  return {
    overall: data?.overall ?? { totalWords: 0, mastered: 0, streak: 0, todayDue: 0 },
    folderStats: data?.folderStats ?? [],
    dailyActivity: data?.dailyActivity ?? [],
    isLoading: data === undefined,
  };
}
