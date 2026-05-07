import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Word } from '../../types';
import WordRow from './word-row';

interface WordListProps {
  words: Word[];
  onEdit: (word: Word) => void;
  onDelete: (word: Word) => void;
}

export default function WordList({ words, onEdit, onDelete }: WordListProps) {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? words.filter((w) =>
        w.word.toLowerCase().startsWith(search.trim().toLowerCase())
      )
    : words;

  return (
    <div className="flex flex-col">
      {/* Search */}
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search words..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
        />
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[calc(100dvh-200px)] rounded-lg border border-gray-800">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">
            {search.trim() ? 'No words match your search' : 'No words yet — add one to get started'}
          </div>
        ) : (
          filtered.map((word) => (
            <WordRow key={word.id} word={word} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}
