import React, { useMemo } from 'react'
import { useEditor, EditorContent, EditorContext } from '@tiptap/react'
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  content?: string
}

const TiptapEditor: React.FC<Props> = ({ content = '<p>Hello World!</p>' }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
  })

  const providerValue = useMemo(() => ({ editor }), [editor])

  if (!editor) return null

  return (
    <EditorContext.Provider value={providerValue}>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
      </FloatingMenu>
      <BubbleMenu editor={editor}>
        <span>Bubble Menu</span>
      </BubbleMenu>
    </EditorContext.Provider>
  )
}

export default TiptapEditor
