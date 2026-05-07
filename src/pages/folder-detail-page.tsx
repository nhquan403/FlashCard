import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronRight, Plus, Upload, BookOpen, Home } from 'lucide-react';
import { db } from '../db/database';
import { deleteWord } from '../db/queries';
import { useWords } from '../hooks/use-words';
import WordList from '../components/words/word-list';
import WordAddEditModal from '../components/words/word-add-edit-modal';
import WordImportModal from '../components/words/word-import-modal';
import type { Word } from '../types';

type ModalState =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; word: Word }
  | { type: 'import' };

export default function FolderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const folderId = Number(id);

  const folder = useLiveQuery(() => db.folders.get(folderId), [folderId]);
  const words = useWords(folderId) ?? [];
  const [modal, setModal] = useState<ModalState>({ type: 'none' });

  const closeModal = () => setModal({ type: 'none' });

  const handleDelete = async (word: Word) => {
    if (word.id != null) {
      await deleteWord(word.id);
    }
  };

  // useLiveQuery returns undefined while loading, then the value (or undefined if not found)
  if (folder === undefined) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <span className="text-gray-500 text-sm">Loading…</span>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Folder not found.</p>
        <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Go home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gray-300 flex items-center gap-1 transition-colors">
            <Home size={13} />
            Home
          </Link>
          <ChevronRight size={13} />
          <span className="text-gray-300 truncate">{folder.name}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{folder.name}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {words.length} {words.length === 1 ? 'word' : 'words'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setModal({ type: 'import' })}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-3 py-2 min-h-[40px] rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors touch-manipulation"
            >
              <Upload size={14} />
              Import
            </button>
            <button
              onClick={() => setModal({ type: 'add' })}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-3 py-2 min-h-[40px] rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors touch-manipulation"
            >
              <Plus size={14} />
              Add Word
            </button>
            <button
              onClick={() => navigate(`/study/${folderId}`)}
              disabled={words.length === 0}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 min-h-[40px] rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              <BookOpen size={14} />
              Study
            </button>
          </div>
        </div>

        {/* Word list */}
        <WordList
          words={words}
          onEdit={(word) => setModal({ type: 'edit', word })}
          onDelete={handleDelete}
        />
      </div>

      {/* Modals */}
      {modal.type === 'add' && (
        <WordAddEditModal folderId={folderId} onClose={closeModal} />
      )}
      {modal.type === 'edit' && (
        <WordAddEditModal word={modal.word} folderId={folderId} onClose={closeModal} />
      )}
      {modal.type === 'import' && (
        <WordImportModal folderId={folderId} onClose={closeModal} />
      )}
    </div>
  );
}
