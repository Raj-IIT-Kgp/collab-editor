'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Bell, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function NotificationDropdown() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();

    const socket: Socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
      auth: { token: useAuthStore.getState().accessToken }
    });

    socket.on('new-notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data);
      setUnreadCount(data.data.filter((n: any) => !n.isRead).length);
    } catch (e) {
      console.error(e);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full relative h-9 w-9 hover:bg-gray-100 transition-colors focus:outline-none">
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        )}
        <span className="sr-only">Toggle notifications</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto">
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-6 text-xs text-indigo-600">
              <Check className="h-3 w-3 mr-1" /> Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No notifications yet.
          </div>
        ) : (
          notifications.map(notif => (
            <DropdownMenuItem 
              key={notif.id} 
              className={`p-3 flex flex-col items-start gap-1 cursor-pointer ${!notif.isRead ? 'bg-indigo-50/50' : ''}`}
              onClick={() => markAsRead(notif.id)}
            >
              {notif.link ? (
                <Link href={notif.link} className="w-full">
                  <p className="text-sm">{notif.content}</p>
                </Link>
              ) : (
                <p className="text-sm">{notif.content}</p>
              )}
              <span className="text-[10px] text-gray-400">
                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
