import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createWord, updateWord } from '../../db/queries';
import type { Word } from '../../types';
import ResponsiveSheet from '../ui/responsive-sheet';

interface WordAddEditModalProps {
  word?: Word;
  folderId: number;
  onClose: () => void;
}

export default function WordAddEditModal({ word, folderId, onClose }: WordAddEditModalProps) {
  const isEdit = Boolean(word);
  const [wordText, setWordText] = useState(word?.word ?? '');
  const [description, setDescription] = useState(word?.description ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedWord = wordText.trim();
    const trimmedDesc = description.trim();
    if (!trimmedWord) { setError('Word is required.'); return; }
    if (!trimmedDesc) { setError('Description is required.'); return; }

    setLoading(true);
    try {
      if (isEdit && word?.id != null) {
        await updateWord(word.id, { word: trimmedWord, description: trimmedDesc });
      } else {
        await createWord(folderId, trimmedWord, trimmedDesc);
      }
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <ResponsiveSheet onClose={onClose} ariaLabel="word form">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1 mb-4">
          <h2 className="text-gray-100 text-lg font-semibold">
            {isEdit ? 'Edit Word' : 'Add Word'}
          </h2>
          <button onClick={onClose} className="relative p-2 -m-1 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors touch-manipulation">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 pb-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-300 text-sm font-medium" htmlFor="word-text">
              Word <span className="text-red-400">*</span>
            </label>
            <input
              id="word-text"
              type="text"
              value={wordText}
              onChange={(e) => { setWordText(e.target.value); setError(''); }}
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
              onChange={(e) => { setDescription(e.target.value); setError(''); }}
              placeholder="e.g. lasting for a very short time"
              rows={3}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500 w-full placeholder-gray-500 resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
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
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Word'}
            </button>
          </div>
        </form>
      </ResponsiveSheet>
    </AnimatePresence>
  );
}
