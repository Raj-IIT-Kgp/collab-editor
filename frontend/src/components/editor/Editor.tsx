'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { LexicalCollaboration } from '@lexical/react/LexicalCollaborationContext';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { TRANSFORMERS } from '@lexical/markdown';
import { ImageNode } from './nodes/ImageNode';
import ImagePlugin from './plugins/ImagePlugin';
import { MarkNode } from '@lexical/mark';
import CommentPlugin from './plugins/CommentPlugin';
import { Provider } from '@lexical/yjs';
import * as Y from 'yjs';
import { io, Socket } from 'socket.io-client';
import { useEffect, useState, useMemo } from 'react';
import { SocketIOProvider } from '@/lib/socket-yjs-provider';
import { useAuthStore } from '@/store/auth.store';
import ToolbarPlugin from './ToolbarPlugin';

interface EditorProps {
  documentId: string;
}

export default function Editor({ documentId }: EditorProps) {
  const { accessToken, user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    const s = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
      auth: { token: accessToken }
    });

    s.on('connect', () => setIsConnected(true));
    s.on('disconnect', () => setIsConnected(false));
    s.on('connect_error', () => setIsConnected(false));

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [accessToken]);

  const initialConfig = {
    namespace: 'CoScribeEditor',
    theme: {
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        code: 'font-mono bg-gray-100 rounded px-1 py-0.5 text-sm',
      },
      heading: {
        h1: 'text-4xl font-bold mb-4 mt-6',
        h2: 'text-3xl font-semibold mb-4 mt-6',
        h3: 'text-2xl font-medium mb-3 mt-5',
      },
      list: {
        ul: 'list-disc ml-6 mb-4',
        ol: 'list-decimal ml-6 mb-4',
        listitem: 'mb-1',
      },
      quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4',
      link: 'text-indigo-600 hover:underline cursor-pointer',
      code: 'block bg-gray-900 text-gray-50 rounded-lg p-4 font-mono text-sm my-4 overflow-x-auto',
    },
    onError(error: Error) {
      console.error(error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      LinkNode,
      AutoLinkNode,
      CodeNode,
      CodeHighlightNode,
      ImageNode,
      MarkNode,
    ],
  };

  const providerFactory = useMemo(() => {
    if (!socket) return undefined;
    return (id: string, yjsDocMap: Map<string, Y.Doc>): Provider => {
      let doc = yjsDocMap.get(id);
      if (!doc) {
        doc = new Y.Doc();
        yjsDocMap.set(id, doc);
      }
      
      const provider = new SocketIOProvider(socket, id, doc);
      provider.awareness.setLocalStateField('user', {
        name: user?.name,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      });
      return provider as any;
    };
  }, [socket, user]);

  if (!socket) {
    return <div className="p-8 text-center text-gray-500">Connecting to collaboration server...</div>;
  }

  return (
    <LexicalCollaboration>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="flex flex-col h-full border rounded-xl overflow-hidden shadow-sm bg-white relative">
          <div className="absolute top-2 right-4 z-20 flex items-center gap-2 text-xs font-medium bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border shadow-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
            {isConnected ? 'Online' : 'Reconnecting...'}
          </div>
          <ToolbarPlugin />
          <div className="relative flex-1 bg-white">
            <RichTextPlugin
              contentEditable={<ContentEditable className="h-full min-h-[500px] w-full p-8 outline-none max-w-none text-gray-800" />}
              placeholder={<div className="absolute top-8 left-8 text-gray-400 pointer-events-none">Start typing... Use Markdown shortcuts!</div>}
              ErrorBoundary={LexicalErrorBoundary as any}
            />
            <CollaborationPlugin
              id={documentId}
              providerFactory={providerFactory!}
              shouldBootstrap={false}
              username={user?.name}
            />
            <ListPlugin />
            <CheckListPlugin />
            <LinkPlugin />
            <TabIndentationPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <ImagePlugin />
            <CommentPlugin />
          </div>
        </div>
      </LexicalComposer>
    </LexicalCollaboration>
  );
}
