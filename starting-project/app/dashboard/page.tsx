import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getNotesByUser } from '@/lib/notes';
import NoteList from '@/components/NoteList';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const notes = getNotesByUser(session.user.id);

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Notes</h1>
            <p className="text-zinc-400 mt-1">
              {notes.length === 0 
                ? 'Create your first note to get started' 
                : `${notes.length} note${notes.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <Link
            href="/notes/new"
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-500/25"
          >
            + New Note
          </Link>
        </div>

        <NoteList notes={notes} />
      </div>
    </div>
  );
}
