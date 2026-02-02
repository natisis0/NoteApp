import Link from 'next/link';

type NoteItem = {
  id: string;
  title: string;
  isPublic: boolean;
  updatedAt: string;
};

type NoteListProps = {
  notes: NoteItem[];
};

export default function NoteList({ notes }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-medium text-zinc-300 mb-2">No notes yet</h3>
        <p className="text-zinc-500">Create your first note to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Link
          key={note.id}
          href={`/notes/${note.id}`}
          className="group block p-5 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800 transition-all"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2">
              {note.title}
            </h3>
            {note.isPublic && (
              <span className="shrink-0 px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                Public
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-500">
            Updated {new Date(note.updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </Link>
      ))}
    </div>
  );
}
