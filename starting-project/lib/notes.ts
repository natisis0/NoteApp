import { nanoid } from 'nanoid';
import { query, get, run } from './db';

// TypeScript types
export type Note = {
  id: string;
  userId: string;
  title: string;
  contentJson: string;
  isPublic: boolean;
  publicSlug: string | null;
  createdAt: string;
  updatedAt: string;
};

// Database row type (snake_case)
type NoteRow = {
  id: string;
  user_id: string;
  title: string;
  content_json: string;
  is_public: number;
  public_slug: string | null;
  created_at: string;
  updated_at: string;
};

// Convert database row to Note type
function rowToNote(row: NoteRow): Note {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    contentJson: row.content_json,
    isPublic: row.is_public === 1,
    publicSlug: row.public_slug,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Default empty TipTap document
const defaultContent = JSON.stringify({
  type: 'doc',
  content: [{ type: 'paragraph' }],
});

/**
 * Create a new note for a user
 */
export function createNote(
  userId: string,
  data: { title?: string; contentJson?: string } = {}
): Note {
  const id = nanoid();
  const title = data.title || 'Untitled note';
  const contentJson = data.contentJson || defaultContent;
  const now = new Date().toISOString();

  run(
    `INSERT INTO notes (id, user_id, title, content_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, userId, title, contentJson, now, now]
  );

  return {
    id,
    userId,
    title,
    contentJson,
    isPublic: false,
    publicSlug: null,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Get a note by ID, ensuring it belongs to the user
 */
export function getNoteById(userId: string, noteId: string): Note | null {
  const row = get<NoteRow>(
    `SELECT * FROM notes WHERE id = ? AND user_id = ?`,
    [noteId, userId]
  );
  return row ? rowToNote(row) : null;
}

/**
 * Get all notes for a user
 */
export function getNotesByUser(userId: string): Note[] {
  const rows = query<NoteRow>(
    `SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC`,
    [userId]
  );
  return rows.map(rowToNote);
}

/**
 * Update a note's title and/or content
 */
export function updateNote(
  userId: string,
  noteId: string,
  data: Partial<{ title: string; contentJson: string }>
): Note | null {
  const existing = getNoteById(userId, noteId);
  if (!existing) return null;

  const title = data.title ?? existing.title;
  const contentJson = data.contentJson ?? existing.contentJson;
  const now = new Date().toISOString();

  run(
    `UPDATE notes SET title = ?, content_json = ?, updated_at = ? WHERE id = ? AND user_id = ?`,
    [title, contentJson, now, noteId, userId]
  );

  return {
    ...existing,
    title,
    contentJson,
    updatedAt: now,
  };
}

/**
 * Delete a note
 */
export function deleteNote(userId: string, noteId: string): boolean {
  const result = run(
    `DELETE FROM notes WHERE id = ? AND user_id = ?`,
    [noteId, userId]
  );
  return result.changes > 0;
}

/**
 * Toggle public sharing for a note
 */
export function setNotePublic(
  userId: string,
  noteId: string,
  isPublic: boolean
): Note | null {
  const existing = getNoteById(userId, noteId);
  if (!existing) return null;

  const now = new Date().toISOString();
  let publicSlug: string | null = existing.publicSlug;

  if (isPublic && !publicSlug) {
    // Generate a new public slug (16 characters for security)
    publicSlug = nanoid(16);
  } else if (!isPublic) {
    // Clear the public slug
    publicSlug = null;
  }

  run(
    `UPDATE notes SET is_public = ?, public_slug = ?, updated_at = ? WHERE id = ? AND user_id = ?`,
    [isPublic ? 1 : 0, publicSlug, now, noteId, userId]
  );

  return {
    ...existing,
    isPublic,
    publicSlug,
    updatedAt: now,
  };
}

/**
 * Get a public note by its slug
 */
export function getNoteByPublicSlug(slug: string): Note | null {
  const row = get<NoteRow>(
    `SELECT * FROM notes WHERE public_slug = ? AND is_public = 1`,
    [slug]
  );
  return row ? rowToNote(row) : null;
}
