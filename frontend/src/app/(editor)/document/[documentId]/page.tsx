'use client';

import { useParams } from 'next/navigation';
import Editor from '@/components/editor/Editor';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import ShareModal from '@/components/documents/ShareModal';
import VersionHistoryModal from '@/components/documents/VersionHistoryModal';
import CommentsSidebar from '@/components/documents/CommentsSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DocumentPage() {
  const params = useParams();
  const documentId = params.documentId as string;

  const { data: document, isLoading } = useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const { data } = await api.get(`/documents/${documentId}`);
      return data;
    },
  });

  if (isLoading) {
    return <div className="h-full w-full flex items-center justify-center text-gray-500">Loading document metadata...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-50/30">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-4 flex-1">
          <Link href={`/workspace/${document?.workspaceId}`}>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-indigo-600">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <input 
            type="text" 
            defaultValue={document?.title}
            className="text-xl font-bold bg-transparent outline-none border-none placeholder-gray-300 w-1/2 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
            placeholder="Untitled Document"
            onChange={(e) => {
               const val = e.target.value;
               if ((window as any).titleTimeout) clearTimeout((window as any).titleTimeout);
               (window as any).titleTimeout = setTimeout(() => {
                 api.put(`/documents/${documentId}`, { title: val }).catch(console.error);
               }, 500);
            }}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <CommentsSidebar documentId={documentId} />
          <VersionHistoryModal documentId={documentId} />
          <ShareModal 
            documentId={documentId} 
            isPublic={document?.isPublic} 
            publicRole={document?.publicRole} 
          />
        </div>
      </div>
      <div className="flex-1 min-h-0 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Editor documentId={documentId} />
      </div>
    </div>
  );
}
