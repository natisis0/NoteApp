'use client';

import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            NoteApp
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {isPending ? (
            <div className="w-20 h-8 bg-zinc-800 rounded animate-pulse" />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-500">
                  {session.user.name || session.user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
