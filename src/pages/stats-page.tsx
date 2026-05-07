import { useStats } from '../hooks/use-stats';
import { OverallSummary } from '../components/stats/overall-summary';
import { StreakWidget } from '../components/stats/streak-widget';
import { SessionHistoryChart } from '../components/stats/session-history-chart';
import { FolderProgressCard } from '../components/stats/folder-progress-card';

export default function StatsPage() {
  const { overall, folderStats, dailyActivity, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  const hasAnySessions = dailyActivity.some((d) => d.known > 0 || d.forgot > 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Progress</h1>

      {!hasAnySessions && overall.totalWords === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          Start studying to see your progress
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <OverallSummary stats={overall} />

          <StreakWidget streak={overall.streak} dailyActivity={dailyActivity} />

          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-200">Study History</h2>
            <SessionHistoryChart data={dailyActivity} />
          </section>

          {folderStats.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 text-gray-200">Folder Progress</h2>
              <div className="flex flex-col gap-3">
                {folderStats.map((fs) => (
                  <FolderProgressCard key={fs.folder.id} stats={fs} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
