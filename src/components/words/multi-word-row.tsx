import { X } from 'lucide-react';

export interface RowData {
  id: string;
  word: string;
  description: string;
  pronunciation: string;
}

interface MultiWordRowProps {
  row: RowData;
  isOnly: boolean;
  isLast: boolean;
  onChange: (id: string, field: keyof Omit<RowData, 'id'>, value: string) => void;
  onRemove: (id: string) => void;
  onAddRow: () => void;
}

export default function MultiWordRow({ row, isOnly, isLast, onChange, onRemove, onAddRow }: MultiWordRowProps) {
  const handlePronunciationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && !e.shiftKey && isLast) {
      e.preventDefault();
      onAddRow();
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-800 border border-gray-700 rounded-lg">
      <div className="flex gap-2">
        <input
          type="text"
          value={row.word}
          onChange={(e) => onChange(row.id, 'word', e.target.value)}
          placeholder="Word *"
          className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-gray-100 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
        />
        <button
          type="button"
          onClick={() => onRemove(row.id)}
          disabled={isOnly}
          title="Remove row"
          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
      <input
        type="text"
        value={row.description}
        onChange={(e) => onChange(row.id, 'description', e.target.value)}
        placeholder="Description *"
        className="bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-gray-100 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
      />
      <input
        type="text"
        value={row.pronunciation}
        onChange={(e) => onChange(row.id, 'pronunciation', e.target.value)}
        onKeyDown={handlePronunciationKeyDown}
        placeholder="Pronunciation (optional) — Tab to add next row"
        className="bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-gray-100 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
      />
    </div>
  );
}
