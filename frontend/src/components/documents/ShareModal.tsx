'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Users, Search, Link as LinkIcon, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ShareModalProps {
  documentId: string;
  isPublic: boolean;
  publicRole: string;
}

export default function ShareModal({ documentId, isPublic, publicRole }: ShareModalProps) {
  const [open, setOpen] = useState(false);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('VIEWER');
  const [isSearching, setIsSearching] = useState(false);
  const [pubToggle, setPubToggle] = useState(isPublic);
  const [pubRole, setPubRole] = useState(publicRole);

  useEffect(() => {
    if (open) fetchPermissions();
  }, [open]);

  const fetchPermissions = async () => {
    try {
      const { data } = await api.get(`/documents/${documentId}/permissions`);
      setPermissions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = async () => {
    if (!email) return;
    setIsSearching(true);
    try {
      const { data: user } = await api.get(`/users/search/${email}`);
      if (!user) {
        alert('User not found');
        return;
      }
      
      await api.put(`/documents/${documentId}/permissions/${user.id}`, { role });
      setEmail('');
      fetchPermissions();
    } catch (e) {
      console.error(e);
      alert('Failed to share document');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await api.delete(`/documents/${documentId}/permissions/${userId}`);
      fetchPermissions();
    } catch (e) {
      console.error(e);
    }
  };

  const updatePermission = async (userId: string, newRole: string) => {
    try {
      await api.put(`/documents/${documentId}/permissions/${userId}`, { role: newRole });
      fetchPermissions();
    } catch (e) {
      console.error(e);
      alert('Failed to update role');
    }
  };

  const handlePublicToggle = async (newVal: boolean) => {
    try {
      await api.put(`/documents/${documentId}`, { isPublic: newVal });
      setPubToggle(newVal);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublicRole = async (newRole: string) => {
    try {
      await api.put(`/documents/${documentId}`, { publicRole: newRole });
      setPubRole(newRole);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs gap-2">
        <Share2 className="h-4 w-4" /> Share
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex gap-2 items-center">
            <Input 
              placeholder="Add people by email..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Select value={role} onValueChange={(val) => setRole(val as string)}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEWER">Viewer</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleShare} disabled={isSearching || !email}>
              Invite
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2 text-gray-500">
              <Users className="h-4 w-4" /> People with access
            </h4>
            {permissions.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs">
                    {p.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.user.name}</p>
                    <p className="text-xs text-gray-500">{p.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={p.role} onValueChange={(newRole) => updatePermission(p.user.id, newRole as string)}>
                    <SelectTrigger className="w-[100px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                      <SelectItem value="EDITOR">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleRemove(p.user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {permissions.length === 0 && <p className="text-sm text-gray-500 italic">No one has been invited yet.</p>}
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <LinkIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">General access</h4>
                  <p className="text-xs text-gray-500">Anyone with the link</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePublicToggle(!pubToggle)}
                  className={pubToggle ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : ''}
                >
                  {pubToggle ? 'Public' : 'Restricted'}
                </Button>
                {pubToggle && (
                  <Select value={pubRole} onValueChange={(val) => handlePublicRole(val as string)}>
                    <SelectTrigger className="w-[100px] h-8 text-xs">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                      <SelectItem value="EDITOR">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            {pubToggle && (
              <div className="mt-4 flex gap-2">
                <Input readOnly value={typeof window !== 'undefined' ? window.location.href : ''} className="h-8 text-xs bg-gray-50" />
                <Button size="sm" className="h-8 text-xs" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  Copy
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
