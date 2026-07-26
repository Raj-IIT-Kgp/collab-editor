import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { useEffect } from 'react';
import { $createImageNode, ImageNode } from '../nodes/ImageNode';

export type InsertImagePayload = Readonly<{
  altText: string;
  src: string;
}>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand(
  'INSERT_IMAGE_COMMAND',
);

export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagePlugin: ImageNode not registered on editor');
    }

    return editor.registerCommand<InsertImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload);
        $insertNodes([imageNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
