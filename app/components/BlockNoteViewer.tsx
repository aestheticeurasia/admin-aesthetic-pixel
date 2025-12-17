"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface BlogContentViewerProps {
  content: string;
}

export default function BlogContentViewer({ content }: BlogContentViewerProps) {
  const editor = useCreateBlockNote({
    initialContent: JSON.parse(content),
    editable: false,
  });

  return (
    <div className="prose dark:prose-invert max-w-none">
      <BlockNoteView
        editor={editor}
        theme="system"
        editable={false}
      />
    </div>
  );
}