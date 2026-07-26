'use client';

import { useAuthStore } from '@/store/auth.store';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationDropdown from './NotificationDropdown';
import SearchModal from './SearchModal';
import { useParams } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const params = useParams();
  const workspaceId = params?.workspaceId as string;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-6">
      <div className="flex flex-1 items-center gap-4">
        {workspaceId ? (
          <SearchModal workspaceId={workspaceId} />
        ) : (
          <div className="flex-1" />
        )}
      </div>
      <NotificationDropdown />
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'rounded-full' })}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatarUrl || ''} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
