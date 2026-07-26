'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export default function SearchModal({ workspaceId }: { workspaceId: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const debounceTimeout = setTimeout(async () => {
      try {
        const { data } = await api.get(`/search/workspace/${workspaceId}/documents?q=${query}`);
        setResults(data);
      } catch (e) {
        console.error(e);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query, workspaceId]);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="relative flex-1 md:grow-0 w-full md:w-[300px] lg:w-[400px] bg-gray-50 text-left text-gray-500 rounded-lg px-3 py-2 text-sm border hover:bg-gray-100 flex items-center transition-colors"
      >
        <Search className="h-4 w-4 mr-2" />
        Search documents...
        <kbd className="absolute right-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden shadow-2xl gap-0">
          <div className="flex items-center border-b px-4">
            <Search className="h-5 w-5 text-gray-500 shrink-0" />
            <input
              placeholder="Search documents by title..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 px-3 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2">
            {query.trim() !== '' && results.length === 0 && (
              <p className="p-4 text-center text-sm text-gray-500">No results found for "{query}"</p>
            )}
            
            {results.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-indigo-50/50 rounded-lg transition-colors group"
                onClick={() => {
                  setOpen(false);
                  router.push(`/document/${doc.id}`);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium group-hover:text-indigo-700">{doc.title}</h4>
                    {doc.folder && (
                      <p className="text-xs text-gray-500">in {doc.folder.name}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
