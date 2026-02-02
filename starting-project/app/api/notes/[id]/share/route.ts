import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { setNotePublic } from '@/lib/notes';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// POST /api/notes/:id/share - Toggle public sharing
export async function POST(request: NextRequest, context: RouteContext) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  let body: { isPublic?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (typeof body.isPublic !== 'boolean') {
    return NextResponse.json({ error: 'isPublic must be a boolean' }, { status: 400 });
  }

  const note = setNotePublic(session.user.id, id, body.isPublic);

  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: note.id,
    isPublic: note.isPublic,
    publicSlug: note.publicSlug,
  });
}
