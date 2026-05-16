interface WordSingleFieldsProps {
  wordText: string;
  description: string;
  pronunciation: string;
  onWordChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onPronunciationChange: (v: string) => void;
  onClearError: () => void;
}

export default function WordSingleFields({
  wordText, description, pronunciation,
  onWordChange, onDescChange, onPronunciationChange, onClearError,
}: WordSingleFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label className="text-gray-300 text-sm font-medium" htmlFor="word-text">
          Word <span className="text-red-400">*</span>
        </label>
        <input
          id="word-text"
          type="text"
          value={wordText}
          onChange={(e) => { onWordChange(e.target.value); onClearError(); }}
          placeholder="e.g. ephemeral"
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500 w-full placeholder-gray-500"
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-gray-300 text-sm font-medium" htmlFor="word-desc">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          id="word-desc"
          value={description}
          onChange={(e) => { onDescChange(e.target.value); onClearError(); }}
          placeholder="e.g. lasting for a very short time"
          rows={3}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500 w-full placeholder-gray-500 resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-gray-300 text-sm font-medium" htmlFor="word-pronunciation">
          Pronunciation <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          id="word-pronunciation"
          type="text"
          value={pronunciation}
          onChange={(e) => { onPronunciationChange(e.target.value); onClearError(); }}
          placeholder="e.g. /ɪˈfem.ər.əl/"
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500 w-full placeholder-gray-500"
        />
      </div>
    </>
  );
}
