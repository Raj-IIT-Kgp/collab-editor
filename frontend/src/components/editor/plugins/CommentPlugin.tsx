import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { useEffect } from 'react';
import { $wrapSelectionInMarkNode, MarkNode } from '@lexical/mark';

export const INSERT_COMMENT_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_COMMENT_COMMAND',
);

export default function CommentPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([MarkNode])) {
      throw new Error('CommentPlugin: MarkNode not registered on editor');
    }

    return editor.registerCommand<string>(
      INSERT_COMMENT_COMMAND,
      (commentId) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapSelectionInMarkNode(selection, selection.isBackward(), commentId);
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
