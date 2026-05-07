import type { FolderStats } from '../../hooks/use-stats';

interface Props {
  stats: FolderStats;
}

function barColor(pct: number): string {
  if (pct >= 66) return 'bg-green-500';
  if (pct >= 33) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function FolderProgressCard({ stats }: Props) {
  const { folder, total, known, pct } = stats;

  return (
    <div className="bg-gray-900/80 rounded-xl p-4 border border-white/5">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-white truncate">{folder.name}</span>
        <span className="text-sm text-gray-400 ml-2 shrink-0">{total} words</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-[width] duration-500 ease-out ${barColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-400">
        {known} / {total} words known ({pct}%)
      </p>
    </div>
  );
}
