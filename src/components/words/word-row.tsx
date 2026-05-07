import { Pencil, Trash2 } from 'lucide-react';
import type { Word } from '../../types';

interface WordRowProps {
  word: Word;
  onEdit: (word: Word) => void;
  onDelete: (word: Word) => void;
}

export default function WordRow({ word, onEdit, onDelete }: WordRowProps) {
  return (
    <div className="group flex items-center gap-4 py-3 px-4 border-b border-gray-800 hover:bg-gray-900/50">
      <div className="min-w-[120px] shrink-0">
        <span className="font-bold text-gray-100">{word.word}</span>
        {word.pronunciation && (
          <div className="text-gray-500 text-xs font-mono">{word.pronunciation}</div>
        )}
      </div>
      <span
        className="text-gray-400 flex-1 truncate text-sm"
        title={word.description}
      >
        {word.description}
      </span>
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(word)}
          className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded transition-colors"
          aria-label="Edit word"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(word)}
          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition-colors"
          aria-label="Delete word"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
