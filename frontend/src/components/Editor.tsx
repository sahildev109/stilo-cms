import React, { useMemo } from 'react';
import { BlockNoteEditor, Block } from '@blocknote/core';

import { BlockNoteView } from '@blocknote/mantine';
import { useBlockNote, useEditorContentOrSelectionChange } from '@blocknote/react';

import '@blocknote/mantine/style.css';

interface EditorProps {
  initialContent?: Block[];
  onChange: (blocks: Block[]) => void;
  readOnly?: boolean;
}

export const Editor: React.FC<EditorProps> = ({ initialContent, onChange, readOnly }) => {
  

  const safeContent = useMemo(() => {
    if (!initialContent) return undefined;
    return initialContent.map(block => {
      let sanitizedContent = block.content;
      if (Array.isArray(block.content)) {
        sanitizedContent = block.content.map((inline: any) => {
          if (inline.type === 'text') {
            return { ...inline, styles: inline.styles || {} };
          }
          return inline;
        });
      }

      let sanitizedProps = block.props || {};
      if (block.type === 'heading' && !(sanitizedProps as any).level) {
        sanitizedProps = { ...sanitizedProps, level: 1 } as any;
      }

      return {
        ...block,
        props: sanitizedProps,
        children: block.children || [],
        content: sanitizedContent
      };
    }) as Block[];
  }, [initialContent]);

  const editor: BlockNoteEditor = useBlockNote({
    initialContent: safeContent,
  });

  if (editor) {
    editor.isEditable = !readOnly;
  }

  useEditorContentOrSelectionChange(() => {
    if (editor && !readOnly) {
      onChange(editor.topLevelBlocks);
    }
  }, editor);

  // If it's read-only mode (public blog view), we keep the menus off
  if (readOnly) {
    return (
      <BlockNoteView 
        editor={editor} 
        theme='light' 
        sideMenu={false} 
        formattingToolbar={false} 
      />
    );
  }

 
  return <BlockNoteView editor={editor} theme='light' />;
};