import type { OverallStats } from '../../hooks/use-stats';

interface Props {
  stats: OverallStats;
}

interface StatBoxProps {
  label: string;
  value: string | number;
}

function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800/60 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
      <div className="text-3xl font-bold tabular-nums text-blue-400">{value}</div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  );
}

export function OverallSummary({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatBox label="Total Words" value={stats.totalWords} />
      <StatBox label="Mastered" value={stats.mastered} />
      <StatBox label="Streak" value={`🔥 ${stats.streak} days`} />
      <StatBox label="Due Today" value={stats.todayDue} />
    </div>
  );
}
