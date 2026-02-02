import { getNoteByPublicSlug } from '@/lib/notes';
import { notFound } from 'next/navigation';
import PublicNoteViewer from '@/components/PublicNoteViewer';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublicNotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = getNoteByPublicSlug(slug);

  if (!note) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <span className="text-xl">📝</span>
            <span className="font-medium">NoteApp</span>
          </Link>
        </div>

        <PublicNoteViewer title={note.title} contentJson={note.contentJson} />

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            This is a publicly shared note.{' '}
            <Link href="/register" className="text-blue-400 hover:underline">
              Create your own notes
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
