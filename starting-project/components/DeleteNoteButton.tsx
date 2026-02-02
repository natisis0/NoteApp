'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type DeleteNoteButtonProps = {
  noteId: string;
  onDelete: () => Promise<void>;
};

export default function DeleteNoteButton({ noteId, onDelete }: DeleteNoteButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">Delete this note?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-medium rounded transition-colors"
    >
      Delete note
    </button>
  );
}
