import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createFolder, updateFolder } from '../../db/folder-queries';
import type { Folder } from '../../types';
import ResponsiveSheet from '../ui/responsive-sheet';

interface FolderCreateEditModalProps {
  folder?: Folder;
  onClose: () => void;
}

export default function FolderCreateEditModal({ folder, onClose }: FolderCreateEditModalProps) {
  const isEdit = Boolean(folder);
  const [name, setName] = useState(folder?.name ?? '');
  const [description, setDescription] = useState(folder?.description ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError('Name is required.'); return; }

    setLoading(true);
    try {
      if (isEdit && folder?.id != null) {
        await updateFolder(folder.id, { name: trimmed, description: description.trim() || undefined });
      } else {
        await createFolder(trimmed, description.trim() || undefined);
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
      <ResponsiveSheet onClose={onClose} ariaLabel="folder form">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1 mb-4">
          <h2 className="text-gray-100 text-lg font-semibold">
            {isEdit ? 'Edit Folder' : 'New Folder'}
          </h2>
          <button onClick={onClose} className="relative p-2 -m-1 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors touch-manipulation">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 pb-6">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-300 text-sm font-medium" htmlFor="folder-name">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="folder-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. IELTS Vocabulary"
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500 w-full placeholder-gray-500"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-300 text-sm font-medium" htmlFor="folder-desc">
              Description <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="folder-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What words are in this folder?"
              rows={3}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500 w-full placeholder-gray-500 resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Buttons */}
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
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Folder'}
            </button>
          </div>
        </form>
      </ResponsiveSheet>
    </AnimatePresence>
  );
}
