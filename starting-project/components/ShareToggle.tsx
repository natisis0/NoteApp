'use client';

import { useState } from 'react';

type ShareToggleProps = {
  noteId: string;
  isPublic: boolean;
  publicSlug: string | null;
  onToggle: (isPublic: boolean) => Promise<{ publicSlug: string | null }>;
};

export default function ShareToggle({
  noteId,
  isPublic: initialIsPublic,
  publicSlug: initialSlug,
  onToggle,
}: ShareToggleProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [publicSlug, setPublicSlug] = useState(initialSlug);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const result = await onToggle(!isPublic);
      setIsPublic(!isPublic);
      setPublicSlug(result.publicSlug);
    } catch (error) {
      console.error('Failed to toggle sharing:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (publicSlug) {
      const url = `${window.location.origin}/p/${publicSlug}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium text-white">Public Sharing</h3>
          <p className="text-sm text-zinc-500">
            {isPublic ? 'Anyone with the link can view' : 'Only you can access this note'}
          </p>
        </div>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            isPublic ? 'bg-green-500' : 'bg-zinc-600'
          } ${loading ? 'opacity-50' : ''}`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              isPublic ? 'translate-x-6' : ''
            }`}
          />
        </button>
      </div>

      {isPublic && publicSlug && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-700/50">
          <input
            type="text"
            readOnly
            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${publicSlug}`}
            className="flex-1 px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-sm text-zinc-300"
          />
          <button
            onClick={copyLink}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
