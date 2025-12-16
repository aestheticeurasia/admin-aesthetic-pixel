"use client";

import { useCallback, useMemo } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface BlockEditorProps {
  value?: string;              // stored JSON from DB
  onChange: (value: string) => void;
}

export default function BlockEditor({ value, onChange }: BlockEditorProps) {
  const { resolvedTheme } = useTheme();

  const editor = useCreateBlockNote({
    initialContent: value ? JSON.parse(value) : undefined,
  });

  const handleChange = useCallback(() => {
    onChange(JSON.stringify(editor.document));
  }, [editor, onChange]);

  // ✅ Resolve theme properly
  const blockNoteTheme = useMemo<"light" | "dark">(() => {
    return resolvedTheme === "dark" ? "dark" : "light";
  }, [resolvedTheme]);

  return (
    <div className="bg-background">
      <BlockNoteView
        editor={editor}
        theme={blockNoteTheme}
        onChange={handleChange}
      />
    </div>
  );
}