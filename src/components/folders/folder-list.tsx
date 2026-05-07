import FolderCard from './folder-card';
import type { Folder } from '../../types';

interface FolderListProps {
  folders: Folder[];
  onEdit: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
}

export default function FolderList({ folders, onEdit, onDelete }: FolderListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
