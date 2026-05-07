import { Link } from 'react-router-dom';
import { Edit2, Trash2, BookOpen, FolderOpen } from 'lucide-react';
import { useWordCount } from '../../hooks/use-folders';
import type { Folder } from '../../types';

interface FolderCardProps {
  folder: Folder;
  onEdit: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
}

export default function FolderCard({ folder, onEdit, onDelete }: FolderCardProps) {
  const wordCount = useWordCount(folder.id!) ?? 0;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800/80 rounded-2xl p-5 border border-white/5 hover:border-white/10 shadow-lg shadow-black/20 transition-colors active:scale-[0.98] transition-transform flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FolderOpen size={18} className="text-blue-400 shrink-0" />
          <h3 className="text-lg font-semibold text-white truncate">{folder.name}</h3>
        </div>
        <span className="bg-blue-500/20 text-blue-300 border border-blue-500/20 text-xs font-medium px-2 py-0.5 rounded-full shrink-0">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
      </div>

      {/* Description */}
      {folder.description && (
        <p className="text-gray-400 text-sm line-clamp-2">{folder.description}</p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 mt-auto pt-1">
        <Link
          to={`/study/${folder.id}`}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
        >
          <BookOpen size={14} />
          Study
        </Link>
        <Link
          to={`/folder/${folder.id}`}
          className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Words
        </Link>
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => onEdit(folder)}
            className="relative p-2 -m-1 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors touch-manipulation"
            aria-label="Edit folder"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(folder)}
            className="relative p-2 -m-1 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors touch-manipulation"
            aria-label="Delete folder"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
