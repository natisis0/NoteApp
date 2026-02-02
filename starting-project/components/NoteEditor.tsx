'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useState } from 'react';
import EditorToolbar from './EditorToolbar';

type NoteEditorProps = {
  initialContent?: string;
  initialTitle?: string;
  onSave: (data: { title: string; contentJson: object }) => Promise<void>;
  readOnly?: boolean;
};

export default function NoteEditor({
  initialContent,
  initialTitle = 'Untitled note',
  onSave,
  readOnly = false,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Parse initial content
  const parsedContent = initialContent
    ? (() => {
        try {
          return JSON.parse(initialContent);
        } catch {
          return { type: 'doc', content: [{ type: 'paragraph' }] };
        }
      })()
    : { type: 'doc', content: [{ type: 'paragraph' }] };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
    ],
    content: parsedContent,
    editable: !readOnly,
    immediatelyRender: false, // Fix SSR hydration mismatch
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3',
      },
    },
  });

  // Save handler
  const handleSave = useCallback(async () => {
    if (!editor || isSaving) return;

    setIsSaving(true);
    try {
      await onSave({
        title,
        contentJson: editor.getJSON(),
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [editor, title, onSave, isSaving]);

  // Auto-save on content change (debounced)
  useEffect(() => {
    if (!editor || readOnly) return;

    const timeout = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [editor?.getHTML(), title, handleSave, readOnly, editor]);

  // Keyboard shortcut for save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  if (!editor) {
    return (
      <div className="animate-pulse bg-zinc-800 rounded-xl p-8">
        <div className="h-8 bg-zinc-700 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-zinc-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 overflow-hidden">
      {/* Title input */}
      {!readOnly && (
        <div className="border-b border-zinc-700/50 p-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full text-2xl font-bold bg-transparent text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>
      )}

      {/* Toolbar */}
      {!readOnly && <EditorToolbar editor={editor} />}

      {/* Editor content */}
      <div className="min-h-[400px] text-zinc-200">
        <EditorContent editor={editor} />
      </div>

      {/* Status bar */}
      {!readOnly && (
        <div className="border-t border-zinc-700/50 px-4 py-2 flex justify-between items-center text-sm text-zinc-500">
          <span>
            {isSaving ? (
              'Saving...'
            ) : lastSaved ? (
              `Last saved ${lastSaved.toLocaleTimeString()}`
            ) : (
              'Auto-saves while typing'
            )}
          </span>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300 transition-colors disabled:opacity-50"
          >
            Save now
          </button>
        </div>
      )}
    </div>
  );
}
