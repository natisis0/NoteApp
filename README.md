<p align="center">
  <h1 align="center">📝 NoteApp</h1>
  <p align="center">
    <strong>A beautiful, modern note-taking app with rich text editing and public sharing</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#usage">Usage</a>
  </p>
</p>

---

## ✨ Features

- 🔐 **Secure Authentication** — Email/password login with session management
- 📝 **Rich Text Editor** — TipTap-powered editor with formatting toolbar
- 💾 **Auto-Save** — Notes save automatically as you type
- 🔗 **Public Sharing** — Share notes with a unique public URL
- 🌙 **Dark Mode** — Beautiful dark theme by default
- ⚡ **Fast & Responsive** — Server-rendered with Next.js App Router

### Editor Features

| Feature  | Shortcut            |
| -------- | ------------------- |
| Bold     | `Ctrl+B`            |
| Italic   | `Ctrl+I`            |
| Save     | `Ctrl+S`            |
| Headings | H1, H2, H3 buttons  |
| Code     | Inline & block code |
| Lists    | Bullet lists        |

---

## 🛠 Tech Stack

| Category   | Technology                                       |
| ---------- | ------------------------------------------------ |
| Framework  | [Next.js 16](https://nextjs.org/) (App Router)   |
| Language   | [TypeScript](https://www.typescriptlang.org/)    |
| Styling    | [TailwindCSS 4](https://tailwindcss.com/)        |
| Editor     | [TipTap](https://tiptap.dev/)                    |
| Auth       | [better-auth](https://better-auth.com/)          |
| Database   | [SQLite](https://sqlite.org/) via better-sqlite3 |
| Validation | [Zod](https://zod.dev/)                          |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/natisis0/NoteApp.git
cd starting-project

# Install dependencies
npm install

# Initialize the database
npm run db:init

# Create environment file
cp .env.example .env
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📖 Usage

### 1. Create an Account

Navigate to `/register` and create your account with email and password.

### 2. Create Notes

Click **"+ New Note"** from your dashboard to create a new note.

### 3. Edit with Rich Text

Use the toolbar to format your notes:

- **Bold** and _Italic_ text
- Headings (H1, H2, H3)
- `Inline code` and code blocks
- Bullet lists
- Horizontal rules

### 4. Share Publicly

Toggle **"Public Sharing"** to generate a shareable link. Anyone with the link can view your note (read-only).

---

## 📁 Project Structure

```
├── app/
│   ├── (auth)/           # Login & Register pages
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── notes/        # Notes CRUD
│   │   └── public-notes/ # Public note access
│   ├── dashboard/        # User dashboard
│   ├── notes/[id]/       # Note editor
│   └── p/[slug]/         # Public note viewer
├── components/           # React components
├── lib/                  # Utilities & database
└── data/                 # SQLite database file
```

---

## 🔒 Environment Variables

| Variable             | Description                        |
| -------------------- | ---------------------------------- |
| `BETTER_AUTH_SECRET` | Secret key for auth (min 32 chars) |
| `DB_PATH`            | Path to SQLite database file       |

---

## 📜 Available Scripts

| Script            | Description                |
| ----------------- | -------------------------- |
| `npm run dev`     | Start development server   |
| `npm run build`   | Create production build    |
| `npm start`       | Run production server      |
| `npm run db:init` | Initialize database tables |
| `npm run lint`    | Run ESLint                 |

---

## 📄 License

MIT © 2026

---

<p align="center">
  Built with ❤️ using Next.js, TipTap, and SQLite
</p>
