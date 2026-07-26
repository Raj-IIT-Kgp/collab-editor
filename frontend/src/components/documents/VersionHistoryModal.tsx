'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { History, Clock, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface VersionHistoryModalProps {
  documentId: string;
}

export default function VersionHistoryModal({ documentId }: VersionHistoryModalProps) {
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) fetchVersions();
  }, [open]);

  const fetchVersions = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/documents/${documentId}/versions`);
      setVersions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    if (!confirm('Are you sure you want to restore this version? This will overwrite current changes.')) return;
    
    try {
      await api.post(`/documents/${documentId}/versions/${versionId}/restore`);
      alert('Version restored successfully!');
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert('Failed to restore version');
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 text-gray-500 hover:bg-accent hover:text-indigo-600 focus:outline-none" title="Version History">
        <History className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            Version History
          </SheetTitle>
          <SheetDescription>
            View and restore previous versions of this document.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {isLoading ? (
            <p className="text-sm text-gray-500 text-center">Loading versions...</p>
          ) : versions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center italic">No version history available.</p>
          ) : (
            versions.map((version, idx) => (
              <div key={version.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {idx === 0 ? 'Current Version' : `Version ${versions.length - idx}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                  </p>
                  {version.user && (
                    <p className="text-xs text-gray-400">
                      Saved by {version.user.name}
                    </p>
                  )}
                </div>
                {idx !== 0 && (
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => handleRestore(version.id)}>
                    <RotateCcw className="h-3 w-3" /> Restore
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
