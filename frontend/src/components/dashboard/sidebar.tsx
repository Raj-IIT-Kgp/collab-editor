'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { FileText, Folder, Home, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateWorkspaceModal from '@/components/dashboard/CreateWorkspaceModal';

export default function Sidebar() {
  const pathname = usePathname();

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data } = await api.get('/workspaces');
      return data.data;
    },
  });

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50/40">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg tracking-tight text-indigo-600">
          <FileText className="h-6 w-6" />
          <span>CoScribe</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium gap-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-indigo-600 ${
              pathname === '/dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'
            }`}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="mt-4 mb-2 flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Workspaces
            <CreateWorkspaceModal>
              <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-gray-200">
                <Plus className="h-4 w-4" />
              </Button>
            </CreateWorkspaceModal>
          </div>

          {isLoading ? (
            <div className="px-3 py-2 text-gray-400">Loading...</div>
          ) : (
            workspaces?.map((workspace: any) => (
              <Link
                key={workspace.id}
                href={`/workspace/${workspace.id}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-indigo-600 ${
                  pathname.includes(`/workspace/${workspace.id}`) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'
                }`}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white border shadow-sm text-xs font-bold">
                  {workspace.name.charAt(0)}
                </div>
                {workspace.name}
              </Link>
            ))
          )}
        </nav>
      </div>

      <div className="mt-auto border-t p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:text-indigo-600"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}
