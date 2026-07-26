'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CreateWorkspaceModal from '@/components/dashboard/CreateWorkspaceModal';

export default function DashboardPage() {
  const { data: workspaces, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data } = await api.get('/workspaces');
      return data.data;
    },
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your workspaces.</p>
        </div>
        <CreateWorkspaceModal>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Workspace
          </Button>
        </CreateWorkspaceModal>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div>Loading workspaces...</div>
        ) : (
          workspaces?.map((workspace: any) => (
            <Card key={workspace.id} className="hover:border-indigo-200 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold">
                  <Link href={`/workspace/${workspace.id}`} className="hover:underline">
                    {workspace.name}
                  </Link>
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {workspace.name.charAt(0)}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mt-2 text-sm text-gray-500">
                  {workspace.members.length} member(s)
                </CardDescription>
                <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                  <Link href={`/workspace/${workspace.id}`} className="text-indigo-600 font-medium hover:underline flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    View Documents
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
        {workspaces?.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed">
            <h3 className="text-lg font-semibold text-gray-900">No workspaces yet</h3>
            <p className="text-gray-500 mt-1">Create a workspace to start collaborating.</p>
            <CreateWorkspaceModal>
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" /> Create Workspace
              </Button>
            </CreateWorkspaceModal>
          </div>
        )}
      </div>
    </div>
  );
}
