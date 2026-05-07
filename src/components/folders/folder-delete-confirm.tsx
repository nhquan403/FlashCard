import { AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import type { Folder } from '../../types';
import ResponsiveSheet from '../ui/responsive-sheet';

interface FolderDeleteConfirmProps {
  folder: Folder;
  wordCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function FolderDeleteConfirm({
  folder,
  wordCount,
  onConfirm,
  onCancel,
}: FolderDeleteConfirmProps) {
  return (
    <AnimatePresence>
      <ResponsiveSheet onClose={onCancel} ariaLabel="delete folder confirmation">
        <div className="px-6 pt-4 pb-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600/15 mb-4">
            <Trash2 size={22} className="text-red-400" />
          </div>

          <h2 className="text-gray-100 text-lg font-semibold mb-2">Delete Folder</h2>
          <p className="text-gray-400 text-sm mb-6">
            This will permanently delete{' '}
            <span className="text-gray-200 font-medium">"{folder.name}"</span> and all{' '}
            <span className="text-gray-200 font-medium">{wordCount}</span>{' '}
            {wordCount === 1 ? 'word' : 'words'} inside. This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </ResponsiveSheet>
    </AnimatePresence>
  );
}
