'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, accessToken } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!accessToken && mounted) {
      router.push('/login');
    }
  }, [accessToken, router, mounted]);

  if (!mounted || !accessToken) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50/50 w-full overflow-hidden">
      <header className="flex h-14 items-center justify-between border-b bg-white px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex flex-col justify-center">
            <span className="text-sm font-semibold leading-none">CoScribe Editor</span>
            <span className="text-xs text-green-600 font-medium mt-1">Saved to cloud</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-4">
            <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {/* Additional active users could be rendered here dynamically */}
          </div>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Share className="h-4 w-4" /> Share
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden p-6 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
