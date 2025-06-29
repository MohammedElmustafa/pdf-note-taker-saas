"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Code from "@tiptap/extension-code";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import HardBreak from "@tiptap/extension-hard-break";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import Highlight from "@tiptap/extension-highlight";

import EditorExtension from "./EditiorExtension";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TextEditor({ fileId, initialContent = "" }) {
  // 1) Fetch saved notes for this fileId
  const notesFromDB = useQuery(api.notes.GetNotes, { fileId });

  // 2) Initialize the editor *without* content
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      Code,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start typing here…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Blockquote,
      HorizontalRule,
      HardBreak,
      TaskList,
      TaskItem,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Dropcursor,
      Gapcursor,
    ],
    // We'll set content in an effect once notesFromDB is ready
    content: "",
    autofocus: "start",
    editorProps: {
      attributes: { class: "focus:outline-none h-screen p-5" },
    },
  });

  // 3) When the query resolves, populate the editor
  useEffect(() => {
    if (editor) {
      // If we got saved notes, load them; otherwise use the fallback
      const html = notesFromDB != null ? notesFromDB : initialContent;
      editor.commands.setContent(html);
    }
  }, [editor, notesFromDB, initialContent]);

  if (!editor) return <p>Loading editor…</p>;

  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <EditorExtension editor={editor} />
      <div className="overflow-scroll h-[88vh]">
        <EditorContent
          editor={editor}
          className="prose prose-sm sm:prose lg:prose-lg max-w-full"
        />
      </div>
    </div>
  );
}
