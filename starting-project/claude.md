# Project Context: Note Taking Web App

## Quick Summary

A full-stack note-taking application where users can create, edit, and share rich-text notes. Notes are written using a TipTap editor and stored as JSON in SQLite.

---

## Tech Stack

| Layer            | Technology                       |
| ---------------- | -------------------------------- |
| Framework        | Next.js (App Router)             |
| Language         | TypeScript                       |
| Styling          | TailwindCSS                      |
| Rich Text Editor | TipTap                           |
| Authentication   | better-auth                      |
| Database         | SQLite (via Bun's SQLite client) |
| Runtime          | Bun                              |

---

## Project Structure

```
starting-project/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── dashboard/          # Authenticated user dashboard
│   ├── notes/[id]/         # Note editor page
│   ├── p/[slug]/           # Public note viewer
│   ├── (auth)/             # Auth pages (login, register)
│   └── api/                # API routes
│       ├── notes/          # Notes CRUD endpoints
│       └── public-notes/   # Public note access
├── components/             # React components
│   ├── NoteList.tsx
│   ├── NoteEditor.tsx
│   ├── ShareToggle.tsx
│   ├── DeleteNoteButton.tsx
│   └── PublicNoteViewer.tsx
├── lib/                    # Utility modules
│   ├── db.ts               # SQLite database access
│   ├── notes.ts            # Note repository functions
│   └── auth.ts             # better-auth configuration
├── data/                   # Database files
│   └── app.db              # SQLite database
└── spec.md                 # Full technical specification
```

---

## Database Schema

### better-auth Tables (managed by better-auth)

- `user` - User accounts
- `session` - Active sessions
- `account` - Auth providers/credentials
- `verification` - Email verification tokens

### Application Tables

- `notes` - User notes with TipTap JSON content

```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content_json TEXT NOT NULL,
  is_public INTEGER NOT NULL DEFAULT 0,
  public_slug TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES user(id)
);
```

---

## API Endpoints

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| GET    | `/api/notes`              | List user's notes         |
| POST   | `/api/notes`              | Create new note           |
| GET    | `/api/notes/:id`          | Get single note           |
| PUT    | `/api/notes/:id`          | Update note               |
| DELETE | `/api/notes/:id`          | Delete note               |
| POST   | `/api/notes/:id/share`    | Toggle public sharing     |
| GET    | `/api/public-notes/:slug` | Get public note (no auth) |

---

## Key Features

### Authentication

- Email/password registration and login via better-auth
- Session-based auth with protected routes
- Middleware for route protection

### Notes Management

- Create notes with default "Untitled note" title
- Edit notes using TipTap rich text editor
- Auto-update timestamps on save
- Hard delete notes

### Rich Text Editor (TipTap)

- Bold, Italic
- Headings (H1, H2, H3)
- Inline code & code blocks
- Bullet lists
- Horizontal rules

### Note Sharing

- Toggle public visibility
- Generate unique public slug (nanoid)
- Access via `/p/[slug]` URL
- Read-only for anonymous users

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

---

## Dependencies

### Core

- `next` - React framework
- `react` / `react-dom` - UI library
- `typescript` - Type safety

### Authentication

- `better-auth` - Auth library

### Editor

- `@tiptap/react` - TipTap React bindings
- `@tiptap/pm` - ProseMirror integration
- `@tiptap/starter-kit` - Core extensions

### Validation

- `zod` - Schema validation

### Styling

- `tailwindcss` - Utility CSS

---

## Important Notes

1. **All note operations must be scoped to the authenticated user's `user_id`**
2. **TipTap content is stored as JSON string in `content_json` column**
3. **Public slugs should be 16+ characters for security**
4. **Never use `dangerouslySetInnerHTML` with unsanitized data**

---

## Reference

For complete technical details, see [`spec.md`](./spec.md).
