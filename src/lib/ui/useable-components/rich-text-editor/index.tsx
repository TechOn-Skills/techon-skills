"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import Code from "@tiptap/extension-code"
import { useCallback, useEffect } from "react"
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  QuoteIcon,
  UndoIcon,
  RedoIcon,
  LinkIcon,
  CodeIcon,
  UnderlineIcon,
} from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { cn } from "@/lib/helpers"

type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
  className?: string
  "data-testid"?: string
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted-surface/30 p-1 rounded-t-xl">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        <BoldIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        <ItalicIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
      >
        <CodeIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => {
          const url = window.prompt("Link URL:", editor.getAttributes("link").href || "https://")
          if (url !== null) editor.chain().focus().setLink({ href: url || "" }).run()
        }}
      >
        <LinkIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1Icon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2Icon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3Icon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <QuoteIcon className="size-4" />
      </Button>
      <span className="w-px h-5 bg-border mx-0.5" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <UndoIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <RedoIcon className="size-4" />
      </Button>
    </div>
  )
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something…",
  minHeight = "120px",
  className,
  "data-testid": dataTestId,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-(--brand-primary) underline" } }),
      Underline,
      Code,
    ],
    immediatelyRender: false,
    content: value || "",
    editorProps: {
      attributes: {
        class: "chapter-prose prose prose-sm dark:prose-invert max-w-none min-h-[80px] px-3 py-2 focus:outline-none w-full",
      },
      handleDOMEvents: {
        blur: () => {
          onChange(editor?.getHTML() ?? "")
        },
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", {})
    }
  }, [value, editor])

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (dataTestId && el) el.setAttribute("data-testid", dataTestId)
    },
    [dataTestId]
  )

  return (
    <div
      ref={setRef}
      className={cn(
        "rounded-xl border border-input bg-background overflow-hidden",
        className
      )}
    >
      <Toolbar editor={editor} />
      <div style={{ minHeight }} className="[&_.ProseMirror]:min-h-[inherit]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
