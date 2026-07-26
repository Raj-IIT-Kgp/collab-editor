'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function CreateFolderModal({ children, workspaceId }: { children: React.ReactNode, workspaceId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (folderName: string) => {
      const { data } = await api.post('/folders', { name: folderName, workspaceId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId, 'folders'] });
      toast.success('Folder created successfully');
      setOpen(false);
      setName('');
      window.location.reload();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create folder');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate(name.trim());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {React.cloneElement(children as React.ReactElement, {
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          setOpen(true);
        }
      })}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
          <DialogDescription>
            Organize your documents with folders.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Folder Name
            </label>
            <Input
              id="name"
              placeholder="e.g. Q3 Planning"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
