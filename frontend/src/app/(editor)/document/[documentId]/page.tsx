'use client';

import { useParams } from 'next/navigation';
import Editor from '@/components/editor/Editor';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

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
    <div className="h-full w-full flex flex-col">
      <div className="mb-4">
        <input 
          type="text" 
          defaultValue={document?.title}
          className="text-3xl font-bold bg-transparent outline-none border-none placeholder-gray-300 w-full hover:bg-gray-100 p-2 rounded-md transition-colors"
          placeholder="Untitled Document"
          onChange={(e) => {
             // In a real app, debounce this and call api.put(`/documents/${documentId}`, { title: e.target.value })
          }}
        />
      </div>
      <div className="flex-1 min-h-0">
        <Editor documentId={documentId} />
      </div>
    </div>
  );
}
