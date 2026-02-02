'use client';

import { Editor } from '@tiptap/react';

type EditorToolbarProps = {
  editor: Editor;
};

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const buttonClass = (active: boolean) =>
    `px-3 py-1.5 rounded text-sm font-medium transition-colors ${
      active
        ? 'bg-blue-600 text-white'
        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
    }`;

  return (
    <div className="border-b border-zinc-700/50 p-2 flex flex-wrap gap-1">
      {/* Text formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
        title="Bold (Ctrl+B)"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </button>

      <div className="w-px bg-zinc-600 mx-1" />

      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 1 }))}
        title="Heading 1"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 3 }))}
        title="Heading 3"
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={buttonClass(editor.isActive('paragraph'))}
        title="Normal text"
      >
        ¶
      </button>

      <div className="w-px bg-zinc-600 mx-1" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive('bulletList'))}
        title="Bullet list"
      >
        • List
      </button>

      <div className="w-px bg-zinc-600 mx-1" />

      {/* Code */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={buttonClass(editor.isActive('code'))}
        title="Inline code"
      >
        {'</>'}
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={buttonClass(editor.isActive('codeBlock'))}
        title="Code block"
      >
        Code
      </button>

      <div className="w-px bg-zinc-600 mx-1" />

      {/* Horizontal rule */}
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="px-3 py-1.5 rounded text-sm font-medium bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors"
        title="Horizontal rule"
      >
        ―
      </button>
    </div>
  );
}
