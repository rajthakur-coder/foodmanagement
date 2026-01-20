import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $getRoot } from "lexical";

const theme = {};

function Placeholder() {
  return <div className="text-gray-400">Write something here...</div>;
}

export default function MyEditor({ value, onChange }) {
  const config = {
    theme,
    onError(error: any) {
    },
  };

  const handleEditorChange = (editorState: any) => {
    editorState.read(() => {
      const text = $getRoot().getTextContent();
      onChange(text);
    });
  };

  return (
    <div className="p-2 border border-gray-300 rounded-md min-h-36">
      <LexicalComposer initialConfig={config}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none min-h-24" />
          }
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleEditorChange} />
      </LexicalComposer>
    </div>
  );
}
