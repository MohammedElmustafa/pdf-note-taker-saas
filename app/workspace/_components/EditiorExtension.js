"use client";

import React, { useEffect } from "react";
import {
  Heading1,
  Heading2,
  Heading3,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  CodeIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  QuoteIcon,
  SlashIcon,
  CheckSquareIcon,
  TableIcon,
  Sparkles,
  HighlighterIcon,
  SaveIcon,
  PrinterIcon
} from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { chatSession } from "@/configs/AIModel";

export default function EditorExtension({ editor }) {
  if (!editor) return <p>Loading editor…</p>;

  const { fileId } = useParams();
  const SearchAI = useAction(api.myActions.search);
  const saveNotes = useMutation(api.notes.AddNotes);
  const { user } = useUser();

  // Save handler
  const onSaveClick = async () => {
    const html = editor.getHTML();
    try {
      await saveNotes({
        fileId,
        notes: html,
        createdBy: user?.primaryEmailAddress?.emailAddress || "unknown"
      });
      toast.success("Notes saved!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save notes.");
    }
  };

  // Print handler
  const onPrintClick = () => {
    const html = editor.getHTML();
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Notes</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      toast.error("Unable to open print window.");
    }
  };

  // AI handler
  const onAiClick = async () => {
    toast("AI is processing your request...");
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    );
    const results = await SearchAI({ query: selectedText, fileId });
    const parsed = JSON.parse(results);
    const aggregate = parsed.map(item => item.pageContent).join(' ');
    const prompt = `For the question: "${selectedText}", using the content: "${aggregate}", please provide an HTML-formatted answer.`;

    const aiResponse = await chatSession.sendMessage(prompt);
    const text = await aiResponse.response.text();
    const clean = text.replace(/```/g, '').replace(/html/g, '');

    const updatedHtml = editor.getHTML() + `<p><strong>Answer:</strong> ${clean}</p>`;
    editor.commands.setContent(updatedHtml);

    // Auto-save AI result
    await saveNotes({
      fileId,
      notes: updatedHtml,
      createdBy: user?.primaryEmailAddress?.emailAddress || "unknown"
    });
  };

  // Button component to use onMouseDown
  const Button = ({ onClick, active, Icon, label }) => (
    <button
      type="button"
      onMouseDown={e => {
        e.preventDefault();
        onClick();
      }}
      aria-label={label}
      className={`p-3 rounded-md transition-colors ${
        active ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
      }`}>
      <Icon size={16} />
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-2 border-b pb-2 mb-4 bg-gray-50">
      {/* Headings */}
      {[1, 2, 3].map(level => (
        <Button
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          active={editor.isActive('heading', { level })}
          Icon={{ 1: Heading1, 2: Heading2, 3: Heading3 }[level]}
          label={`H${level}`}
        />
      ))}

      {/* Formatting */}
      {[
        { cmd: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), Icon: BoldIcon, label: 'Bold' },
        { cmd: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), Icon: ItalicIcon, label: 'Italic' },
        { cmd: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), Icon: UnderlineIcon, label: 'Underline' },
        { cmd: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code'), Icon: CodeIcon, label: 'Code' }
      ].map((btn, i) => (
        <Button key={i} onClick={btn.cmd} active={btn.active} Icon={btn.Icon} label={btn.label} />
      ))}

      {/* Lists */}
      <Button onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} Icon={ListIcon} label="Bullet List" />
      <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} Icon={ListOrderedIcon} label="Ordered List" />

      {/* Link */}
      <Button onClick={() => {
        const url = prompt('Enter URL');
        if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }} active={editor.isActive('link')} Icon={Link2Icon} label="Link" />

      {/* Alignment */}
      {['left', 'center', 'right', 'justify'].map((align, i) => (
        <Button
          key={align}
          onClick={() => editor.chain().focus().setTextAlign(align).run()}
          active={editor.isActive({ textAlign: align })}
          Icon={[AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon][i]}
          label={`Align ${align}`}
        />
      ))}

      {/* Blocks & Extras */}
      <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} Icon={QuoteIcon} label="Blockquote" />
      <Button onClick={() => editor.chain().focus().setHorizontalRule().run()} Icon={SlashIcon} label="Horizontal Rule" />
      <Button onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} Icon={CheckSquareIcon} label="Task List" />
      <Button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} active={editor.isActive('table')} Icon={TableIcon} label="Table" />

      {/* Highlight */}
      <Button onClick={() => editor.commands.toggleHighlight({ color: '#ffcc00' })} active={editor.isActive('highlight')} Icon={HighlighterIcon} label="Highlight" />

      {/* Save, Print & AI */}
      <Button onClick={onSaveClick} Icon={SaveIcon} label="Save" />
      <Button onClick={onPrintClick} Icon={PrinterIcon} label="Print" />
      <Button onClick={onAiClick} Icon={Sparkles} label="AI" />
    </div>
  );
}