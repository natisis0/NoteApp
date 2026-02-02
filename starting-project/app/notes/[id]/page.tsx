'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NoteEditor from '@/components/NoteEditor';
import ShareToggle from '@/components/ShareToggle';
import DeleteNoteButton from '@/components/DeleteNoteButton';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Note = {
  id: string;
  title: string;
  contentJson: string;
  isPublic: boolean;
  publicSlug: string | null;
};

export default function NoteEditorPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;
  const isNew = noteId === 'new';

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');

  // Fetch existing note
  useEffect(() => {
    if (isNew) {
      // Create a new note and redirect
      createNewNote();
      return;
    }

    async function fetchNote() {
      try {
        const res = await fetch(`/api/notes/${noteId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Note not found');
          } else {
            setError('Failed to load note');
          }
          return;
        }
        const data = await res.json();
        setNote(data);
      } catch {
        setError('Failed to load note');
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [noteId, isNew]);

  async function createNewNote() {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      router.replace(`/notes/${data.id}`);
    } catch {
      setError('Failed to create note');
      setLoading(false);
    }
  }

  const handleSave = async (data: { title: string; contentJson: object }) => {
    if (!note) return;

    const res = await fetch(`/api/notes/${note.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to save');
    }

    const updated = await res.json();
    setNote(updated);
  };

  const handleShareToggle = async (isPublic: boolean) => {
    if (!note) return { publicSlug: null };

    const res = await fetch(`/api/notes/${note.id}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublic }),
    });

    if (!res.ok) {
      throw new Error('Failed to toggle sharing');
    }

    const result = await res.json();
    setNote({ ...note, isPublic: result.isPublic, publicSlug: result.publicSlug });
    return result;
  };

  const handleDelete = async () => {
    if (!note) return;

    const res = await fetch(`/api/notes/${note.id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Failed to delete');
    }
  };

  if (loading || isNew) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/dashboard" className="text-blue-400 hover:underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to dashboard
          </Link>
          <DeleteNoteButton noteId={note.id} onDelete={handleDelete} />
        </div>

        <div className="space-y-6">
          <NoteEditor
            initialContent={note.contentJson}
            initialTitle={note.title}
            onSave={handleSave}
          />

          <ShareToggle
            noteId={note.id}
            isPublic={note.isPublic}
            publicSlug={note.publicSlug}
            onToggle={handleShareToggle}
          />
        </div>
      </div>
    </div>
  );
}
