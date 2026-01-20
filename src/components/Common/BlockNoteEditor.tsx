// src/components/Common/BlockNoteEditor.tsx
import React from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

interface BlockNoteEditorProps {
  value?: string; // BlockNote expects JSON blocks; adapt as needed
  onChange: (jsonString: string) => void;
}

const BlockNoteEditor: React.FC<BlockNoteEditorProps> = ({
  value,
  onChange,
}) => {
  const initialContent = value ? JSON.parse(value) : undefined;

  const editor = useCreateBlockNote({
    initialContent,
    onEditorContentChange: (editorInstance) => {
      // editorInstance.topLevelBlocks is the JSON; stringify it to store
      onChange(JSON.stringify(editorInstance.topLevelBlocks));
    },
  });

  return (
    <div className="p-2 bg-white border rounded-md">
      <BlockNoteView editor={editor} theme="light" />
    </div>
  );
};

export default BlockNoteEditor;