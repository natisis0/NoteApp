import { NextRequest, NextResponse } from 'next/server';
import { getNoteByPublicSlug } from '@/lib/notes';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

// GET /api/public-notes/:slug - Get public note (no auth required)
export async function GET(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const note = getNoteByPublicSlug(slug);

  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }

  // Return only public-safe information
  return NextResponse.json({
    title: note.title,
    contentJson: note.contentJson,
  });
}
