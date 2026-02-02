import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createNote, getNotesByUser } from '@/lib/notes';

// GET /api/notes - List user's notes
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notes = getNotesByUser(session.user.id);

  // Return notes without full content for list performance
  const notesList = notes.map((note) => ({
    id: note.id,
    title: note.title,
    isPublic: note.isPublic,
    publicSlug: note.publicSlug,
    updatedAt: note.updatedAt,
  }));

  return NextResponse.json(notesList);
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { title?: string; contentJson?: string } = {};
  try {
    body = await request.json();
  } catch {
    // Use defaults if no body provided
  }

  const note = createNote(session.user.id, {
    title: body.title,
    contentJson: body.contentJson ? JSON.stringify(body.contentJson) : undefined,
  });

  return NextResponse.json(note, { status: 201 });
}
