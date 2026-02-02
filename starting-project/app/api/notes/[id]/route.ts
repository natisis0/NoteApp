import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getNoteById, updateNote, deleteNote } from '@/lib/notes';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/notes/:id - Get single note
export async function GET(request: NextRequest, context: RouteContext) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const note = getNoteById(session.user.id, id);

  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }

  return NextResponse.json(note);
}

// PUT /api/notes/:id - Update note
export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  let body: { title?: string; contentJson?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const note = updateNote(session.user.id, id, {
    title: body.title,
    contentJson: body.contentJson ? JSON.stringify(body.contentJson) : undefined,
  });

  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }

  return NextResponse.json(note);
}

// DELETE /api/notes/:id - Delete note
export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = deleteNote(session.user.id, id);

  if (!deleted) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
