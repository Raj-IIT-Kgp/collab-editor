'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
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

  useEffect(() => {
    if (!accessToken) return;

    const s = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
      auth: { token: accessToken }
    });

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
      },
    },
    onError(error: Error) {
      console.error(error);
    },
    nodes: [],
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
      // Setup minimal awareness user object
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
    <LexicalComposer initialConfig={initialConfig}>
      <div className="flex flex-col h-full border rounded-xl overflow-hidden shadow-sm bg-white">
        <ToolbarPlugin />
        <div className="relative flex-1 bg-white">
          <RichTextPlugin
            contentEditable={<ContentEditable className="h-full min-h-[500px] w-full p-8 outline-none prose max-w-none" />}
            placeholder={<div className="absolute top-8 left-8 text-gray-400 pointer-events-none">Start typing...</div>}
            ErrorBoundary={LexicalErrorBoundary as any}
          />
          <CollaborationPlugin
            id={documentId}
            providerFactory={providerFactory!}
            shouldBootstrap={false}
            username={user?.name}
          />
        </div>
      </div>
    </LexicalComposer>
  );
}
