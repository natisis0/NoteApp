import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect authenticated users to dashboard
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-7xl mb-6">📝</div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Your ideas,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              beautifully organized
            </span>
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            A simple, elegant note-taking app with rich text editing. 
            Create, organize, and share your notes effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 text-lg"
            >
              Get started for free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-colors text-lg"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 px-4 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything you need to capture your thoughts
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Rich Text Editor</h3>
              <p className="text-zinc-400">
                Format your notes with headings, bold, italic, code blocks, lists, and more.
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold text-white mb-2">Share Publicly</h3>
              <p className="text-zinc-400">
                Share your notes with anyone via a unique public link. Perfect for tutorials and docs.
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <div className="text-4xl mb-4">💾</div>
              <h3 className="text-xl font-semibold text-white mb-2">Auto-Save</h3>
              <p className="text-zinc-400">
                Your notes are saved automatically as you type. Never lose your work again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto text-center text-zinc-500 text-sm">
          Built with Next.js, TipTap, and SQLite
        </div>
      </footer>
    </div>
  );
}
