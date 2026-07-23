'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button, buttonVariants } from '@/components/ui/button';
import { FileText, Folder, Plus, MoreHorizontal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;

  const { data: workspace, isLoading: wsLoading } = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      const { data } = await api.get(`/workspaces/${workspaceId}`);
      return data;
    },
  });

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ['workspace', workspaceId, 'documents'],
    queryFn: async () => {
      const { data } = await api.get(`/documents/workspace/${workspaceId}`);
      return data;
    },
  });

  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ['workspace', workspaceId, 'folders'],
    queryFn: async () => {
      const { data } = await api.get(`/folders/workspace/${workspaceId}`);
      return data;
    },
  });

  if (wsLoading) {
    return <div>Loading workspace...</div>;
  }

  const createNewDocument = async () => {
    try {
      const { data } = await api.post('/documents', {
        title: 'Untitled Document',
        workspaceId,
      });
      router.push(`/document/${data.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{workspace?.name}</h1>
          <p className="text-gray-500 mt-1">Manage folders and collaborative documents.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Folder className="h-4 w-4" /> New Folder
          </Button>
          <Button className="gap-2" onClick={createNewDocument}>
            <Plus className="h-4 w-4" /> New Document
          </Button>
        </div>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        <TabsContent value="documents" className="mt-6">
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docsLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">Loading documents...</TableCell>
                  </TableRow>
                ) : documents?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-gray-500">No documents found.</TableCell>
                  </TableRow>
                ) : (
                  documents?.map((doc: any) => (
                    <TableRow key={doc.id} className="cursor-pointer hover:bg-gray-50/50" onClick={() => router.push(`/document/${doc.id}`)}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-indigo-500" />
                        {doc.title}
                      </TableCell>
                      <TableCell>{doc.owner?.name}</TableCell>
                      <TableCell>{new Date(doc.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger className={buttonVariants({ variant: 'ghost', className: 'h-8 w-8 p-0' })}>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/document/${doc.id}`)}>Open</DropdownMenuItem>
                            <DropdownMenuItem>Rename</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="folders">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mt-6">
            {foldersLoading ? (
               <div>Loading folders...</div>
            ) : folders?.length === 0 ? (
               <div className="col-span-full py-8 text-center text-gray-500">No folders found.</div>
            ) : (
              folders?.map((folder: any) => (
                <div key={folder.id} className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer">
                  <Folder className="h-6 w-6 text-indigo-400" />
                  <span className="font-medium truncate">{folder.name}</span>
                </div>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="members" className="mt-6">
          <div className="rounded-md border bg-white p-6">
            <h3 className="text-lg font-medium mb-4">Workspace Members</h3>
            <ul className="space-y-4">
              {workspace?.members?.map((member: any) => (
                <li key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {member.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{member.user.name}</p>
                      <p className="text-sm text-gray-500">{member.user.email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {member.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
