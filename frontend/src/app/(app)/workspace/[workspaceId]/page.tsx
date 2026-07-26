'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button, buttonVariants } from '@/components/ui/button';
import { toast } from 'sonner';
import CreateFolderModal from '@/components/dashboard/CreateFolderModal';
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
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('EDITOR');

  const { data: workspace, isLoading: wsLoading } = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      const { data } = await api.get(`/workspaces/${workspaceId}`);
      return data.data;
    },
  });

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ['workspace', workspaceId, 'documents'],
    queryFn: async () => {
      const { data } = await api.get(`/documents/workspace/${workspaceId}`);
      return data.data;
    },
  });

  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ['workspace', workspaceId, 'folders'],
    queryFn: async () => {
      const { data } = await api.get(`/folders/workspace/${workspaceId}`);
      return data.data;
    },
  });

  const { data: starredDocs, isLoading: starredLoading, refetch: refetchStarred } = useQuery({
    queryKey: ['workspace', workspaceId, 'starred'],
    queryFn: async () => {
      const { data } = await api.get(`/documents/workspace/${workspaceId}/starred`);
      return data.data;
    },
  });

  const { data: trashDocs, isLoading: trashLoading, refetch: refetchTrash } = useQuery({
    queryKey: ['workspace', workspaceId, 'trash'],
    queryFn: async () => {
      const { data } = await api.get(`/documents/workspace/${workspaceId}/trash`);
      return data.data;
    },
  });

  const refetchAll = () => {
    // refetch docs
    api.get(`/documents/workspace/${workspaceId}`).then(() => {}); // Trigger React Query invalidation in a real app, here we just force a reload or use queryClient
    window.location.reload(); // Simple approach for now
  };

  if (wsLoading) {
    return <div>Loading workspace...</div>;
  }

  const createNewDocument = async () => {
    try {
      const { data } = await api.post('/documents', {
        title: 'Untitled Document',
        workspaceId,
      });
      router.push(`/document/${data.data.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = async (action: string, docId: string, currentVal?: boolean) => {
    try {
      if (action === 'delete') {
        await api.put(`/documents/${docId}`, { isDeleted: true });
      } else if (action === 'restore') {
        await api.put(`/documents/${docId}`, { isDeleted: false });
      } else if (action === 'permanent_delete') {
        await api.delete(`/documents/${docId}`);
      } else if (action === 'star') {
        await api.put(`/documents/${docId}`, { isStarred: !currentVal });
      } else if (action === 'duplicate') {
        await api.post(`/documents/${docId}/duplicate`);
      }
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert('Action failed');
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      await api.post(`/workspaces/${workspaceId}/members`, { 
        email: inviteEmail.trim(), 
        role: inviteRole 
      });
      toast.success('Member invited successfully');
      setInviteEmail('');
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to invite user');
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
          <CreateFolderModal workspaceId={workspaceId}>
            <Button variant="outline" className="gap-2">
              <Folder className="h-4 w-4" /> New Folder
            </Button>
          </CreateFolderModal>
          <Button className="gap-2" onClick={createNewDocument}>
            <Plus className="h-4 w-4" /> New Document
          </Button>
        </div>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="trash">Trash</TabsTrigger>
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
                            <DropdownMenuItem onClick={() => handleAction('star', doc.id, doc.isStarred)}>
                              {doc.isStarred ? 'Unstar' : 'Star'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('duplicate', doc.id)}>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleAction('delete', doc.id)}>Move to Trash</DropdownMenuItem>
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

        <TabsContent value="starred" className="mt-6">
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
                {starredLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">Loading...</TableCell>
                  </TableRow>
                ) : starredDocs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-gray-500">No starred documents.</TableCell>
                  </TableRow>
                ) : (
                  starredDocs?.map((doc: any) => (
                    <TableRow key={doc.id} className="cursor-pointer hover:bg-gray-50/50" onClick={() => router.push(`/document/${doc.id}`)}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-yellow-500" />
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
                            <DropdownMenuItem onClick={() => handleAction('star', doc.id, doc.isStarred)}>Unstar</DropdownMenuItem>
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
            
            <form onSubmit={handleInvite} className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg border">
              <div className="flex-1">
                <input 
                  type="email" 
                  placeholder="Invite user by email (e.g. colleague@example.com)" 
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <select 
                value={inviteRole} 
                onChange={e => setInviteRole(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white text-sm outline-none focus:border-indigo-500"
              >
                <option value="VIEWER">Viewer</option>
                <option value="EDITOR">Editor</option>
                <option value="ADMIN">Admin</option>
              </select>
              <Button type="submit" className="gap-2">
                <Plus className="h-4 w-4" /> Invite
              </Button>
            </form>

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

        <TabsContent value="trash" className="mt-6">
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
                {trashLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">Loading...</TableCell>
                  </TableRow>
                ) : trashDocs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-gray-500">Trash is empty.</TableCell>
                  </TableRow>
                ) : (
                  trashDocs?.map((doc: any) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium flex items-center gap-2 text-gray-500 line-through">
                        <FileText className="h-4 w-4" />
                        {doc.title}
                      </TableCell>
                      <TableCell>{doc.owner?.name}</TableCell>
                      <TableCell>{new Date(doc.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger className={buttonVariants({ variant: 'ghost', className: 'h-8 w-8 p-0' })}>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction('restore', doc.id)}>Restore</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleAction('permanent_delete', doc.id)}>Permanent Delete</DropdownMenuItem>
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
      </Tabs>
    </div>
  );
}
