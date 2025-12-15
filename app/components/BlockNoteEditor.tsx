"use client";

import { useCallback } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface BlockEditorProps {
  value?: string;              // stored JSON from DB
  onChange: (value: string) => void;
}

export default function BlockEditor({ value, onChange }: BlockEditorProps) {
  // Create editor instance once
  const editor = useCreateBlockNote({
    initialContent: value ? JSON.parse(value) : undefined,
  });

  // Called whenever content changes
  const handleChange = useCallback(() => {
    const json = JSON.stringify(editor.document);
    onChange(json);
  }, [editor, onChange]);

  return (
    <div className="dark:bg-neutral-900">
      <BlockNoteView
        editor={editor}
        theme="light"
        onChange={handleChange}
      />
    </div>
  );
}
