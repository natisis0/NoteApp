'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

type PublicNoteViewerProps = {
  title: string;
  contentJson: string;
};

export default function PublicNoteViewer({ title, contentJson }: PublicNoteViewerProps) {
  // Parse content
  const parsedContent = (() => {
    try {
      return JSON.parse(contentJson);
    } catch {
      return { type: 'doc', content: [{ type: 'paragraph' }] };
    }
  })();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
    ],
    content: parsedContent,
    editable: false,
    immediatelyRender: false, // Fix SSR hydration mismatch
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none px-4 py-3',
      },
    },
  });

  if (!editor) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-zinc-700 rounded w-1/2 mb-6"></div>
        <div className="h-64 bg-zinc-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 overflow-hidden">
      <div className="border-b border-zinc-700/50 p-6">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
      </div>
      <div className="min-h-[300px] text-zinc-200">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
