interface SessionCompleteProps {
  known: number;
  forgot: number;
  onRestart: () => void;
  onBack: () => void;
  onStudyStruggling?: () => void;
}

export default function SessionComplete({ known, forgot, onRestart, onBack, onStudyStruggling }: SessionCompleteProps) {
  const total = known + forgot;
  const successRate = total > 0 ? Math.round((known / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-4 text-center">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl p-6 sm:p-10 max-w-sm w-full">
        <h1 className="text-[clamp(1.5rem,5vw,2rem)] font-bold text-gray-100 mb-2">
          Session Complete!
        </h1>
        <p className="text-4xl mb-6">🎉</p>

        <div className="bg-gray-800 rounded-2xl p-6 mb-8 space-y-2">
          <div className="flex justify-between text-lg">
            <span className="text-green-400 font-semibold">Knew</span>
            <span className="text-gray-100 font-bold">{known}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-red-400 font-semibold">Forgot</span>
            <span className="text-gray-100 font-bold">{forgot}</span>
          </div>
          <div className="border-t border-gray-700 pt-2 flex justify-between text-lg">
            <span className="text-gray-400">Success rate</span>
            <span className="text-gray-100 font-bold">{successRate}%</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {onStudyStruggling && (
            <button
              onClick={onStudyStruggling}
              className="w-full min-h-[48px] py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-colors touch-manipulation"
            >
              Re-study Forgotten ({forgot})
            </button>
          )}
          <button
            onClick={onRestart}
            className="w-full min-h-[48px] py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors touch-manipulation"
          >
            Study Again
          </button>
          <button
            onClick={onBack}
            className="w-full min-h-[48px] py-3 rounded-2xl bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold transition-colors touch-manipulation"
          >
            Back to Folder
          </button>
        </div>
      </div>
    </div>
  );
}
