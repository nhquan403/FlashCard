import { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { useFolders, useWordCount } from '../hooks/use-folders';
import { deleteFolder } from '../db/folder-queries';
import FolderList from '../components/folders/folder-list';
import FolderCreateEditModal from '../components/folders/folder-create-edit-modal';
import FolderDeleteConfirm from '../components/folders/folder-delete-confirm';
import type { Folder } from '../types';

type ModalState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; folder: Folder }
  | { type: 'delete'; folder: Folder };

function DeleteConfirmWrapper({
  folder,
  onConfirm,
  onCancel,
}: {
  folder: Folder;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const wordCount = useWordCount(folder.id!) ?? 0;
  return (
    <FolderDeleteConfirm
      folder={folder}
      wordCount={wordCount}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export default function HomePage() {
  const folders = useFolders();
  const [modal, setModal] = useState<ModalState>({ type: 'none' });

  const closeModal = () => setModal({ type: 'none' });

  const handleDelete = async (folder: Folder) => {
    if (folder.id != null) {
      await deleteFolder(folder.id);
    }
    closeModal();
  };

  const isLoading = folders === undefined;
  const folderList = folders ?? [];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BookOpen size={28} className="text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-100">FlashLearn</h1>
          </div>
          <button
            onClick={() => setModal({ type: 'create' })}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            New Folder
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-gray-500 text-sm">Loading…</div>
        ) : folderList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
              <BookOpen size={28} className="text-gray-600" />
            </div>
            <p className="text-gray-400 text-base">
              No folders yet — create one to start learning
            </p>
            <button
              onClick={() => setModal({ type: 'create' })}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={15} />
              Create Folder
            </button>
          </div>
        ) : (
          <FolderList
            folders={folderList}
            onEdit={(folder) => setModal({ type: 'edit', folder })}
            onDelete={(folder) => setModal({ type: 'delete', folder })}
          />
        )}
      </div>

      {/* Modals */}
      {modal.type === 'create' && <FolderCreateEditModal onClose={closeModal} />}
      {modal.type === 'edit' && (
        <FolderCreateEditModal folder={modal.folder} onClose={closeModal} />
      )}
      {modal.type === 'delete' && (
        <DeleteConfirmWrapper
          folder={modal.folder}
          onConfirm={() => handleDelete(modal.folder)}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}
