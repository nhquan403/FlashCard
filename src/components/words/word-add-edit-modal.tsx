import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { createWord, updateWord, bulkCreateWords } from '../../db/queries';
import type { Word } from '../../types';
import ResponsiveSheet from '../ui/responsive-sheet';
import MultiWordRow, { type RowData } from './multi-word-row';
import WordSingleFields from './word-single-fields';

interface WordAddEditModalProps {
  word?: Word;
  folderId: number;
  onClose: () => void;
}

type Mode = 'single' | 'multi';

function makeRow(): RowData {
  return { id: crypto.randomUUID(), word: '', description: '', pronunciation: '' };
}

export default function WordAddEditModal({ word, folderId, onClose }: WordAddEditModalProps) {
  const isEdit = Boolean(word);

  const [wordText, setWordText] = useState(word?.word ?? '');
  const [description, setDescription] = useState(word?.description ?? '');
  const [pronunciation, setPronunciation] = useState(word?.pronunciation ?? '');
  const [rows, setRows] = useState<RowData[]>([makeRow()]);
  const [mode, setMode] = useState<Mode>('single');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setWordText('');
    setDescription('');
    setPronunciation('');
    setRows([makeRow()]);
  };

  const handleRowChange = (id: string, field: keyof Omit<RowData, 'id'>, value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    setError('');
  };

  const handleRowRemove = (id: string) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  };

  const handleAddRow = () => setRows((prev) => [...prev, makeRow()]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'single' || isEdit) {
      const trimmedWord = wordText.trim();
      const trimmedDesc = description.trim();
      if (!trimmedWord) { setError('Word is required.'); return; }
      if (!trimmedDesc) { setError('Description is required.'); return; }
      setLoading(true);
      try {
        if (isEdit && word?.id != null) {
          await updateWord(word.id, { word: trimmedWord, description: trimmedDesc, pronunciation: pronunciation.trim() || undefined });
        } else {
          await createWord(folderId, trimmedWord, trimmedDesc, pronunciation.trim() || undefined);
        }
        onClose();
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    const validRows = rows.filter((r) => r.word.trim() && r.description.trim());
    if (validRows.length === 0) {
      setError('At least one row with a word and description is required.');
      return;
    }
    setLoading(true);
    try {
      await bulkCreateWords(folderId, validRows.map((r) => ({
        word: r.word.trim(),
        description: r.description.trim(),
        ...(r.pronunciation.trim() ? { pronunciation: r.pronunciation.trim() } : {}),
      })));
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validCount = mode === 'multi'
    ? rows.filter((r) => r.word.trim() && r.description.trim()).length
    : 0;

  return (
    <AnimatePresence>
      <ResponsiveSheet onClose={onClose} ariaLabel="word form">
        <div className="flex items-center justify-between px-6 pt-4 pb-1 mb-2">
          <h2 className="text-gray-100 text-lg font-semibold">
            {isEdit ? 'Edit Word' : 'Add Word'}
          </h2>
          <button
            onClick={onClose}
            className="relative p-2 -m-1 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors touch-manipulation"
          >
            <X size={18} />
          </button>
        </div>

        {!isEdit && (
          <div className="flex gap-1 px-6 mb-4">
            {(['single', 'multi'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  mode === m
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
              >
                {m === 'single' ? 'Single' : 'Multiple'}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 pb-6">
          {(mode === 'single' || isEdit) && (
            <WordSingleFields
              wordText={wordText}
              description={description}
              pronunciation={pronunciation}
              onWordChange={setWordText}
              onDescChange={setDescription}
              onPronunciationChange={setPronunciation}
              onClearError={() => setError('')}
            />
          )}

          {mode === 'multi' && !isEdit && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-1">
                {rows.map((row, i) => (
                  <MultiWordRow
                    key={row.id}
                    row={row}
                    isOnly={rows.length === 1}
                    isLast={i === rows.length - 1}
                    onChange={handleRowChange}
                    onRemove={handleRowRemove}
                    onAddRow={handleAddRow}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors self-start"
              >
                <Plus size={15} />
                Add row
              </button>
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-1">
            {mode === 'multi' && validCount > 0 && (
              <span className="text-sm text-gray-400 mr-auto">
                {validCount} ready
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Saving…'
                : isEdit
                  ? 'Save Changes'
                  : mode === 'multi'
                    ? (validCount > 0 ? `Add ${validCount} Word${validCount !== 1 ? 's' : ''}` : 'Add Words')
                    : 'Add Word'}
            </button>
          </div>
        </form>
      </ResponsiveSheet>
    </AnimatePresence>
  );
}
