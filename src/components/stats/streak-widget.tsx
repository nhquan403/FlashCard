import type { DailyActivity } from '../../hooks/use-stats';

interface Props {
  streak: number;
  dailyActivity: DailyActivity[];
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getLast7Dates(): string[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return toDateStr(d);
  });
}

export function StreakWidget({ streak, dailyActivity }: Props) {
  const last7 = getLast7Dates();
  const activeDates = new Set(
    dailyActivity
      .filter((d) => d.known > 0 || d.forgot > 0)
      .map((d) => d.date)
  );

  return (
    <div className="bg-gradient-to-br from-orange-950/40 to-gray-900 rounded-2xl p-4 border border-orange-500/20">
      <div className="text-2xl font-bold text-orange-400 mb-3">
        <span className="text-3xl">🔥</span> {streak} day streak
      </div>
      <div className="flex gap-2">
        {last7.map((date) => (
          <div key={date} className="flex flex-col items-center gap-1">
            <div
              className={`w-6 h-6 rounded-full ${
                activeDates.has(date)
                  ? 'bg-green-400 ring-1 ring-green-400/50'
                  : 'bg-gray-700'
              }`}
            />
            <span className="text-xs text-gray-500">
              {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'narrow' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
