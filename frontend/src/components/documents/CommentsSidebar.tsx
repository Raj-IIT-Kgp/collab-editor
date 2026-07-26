'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function CommentsSidebar({ documentId }: { documentId: string }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (open) fetchComments();
  }, [open]);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/documents/${documentId}/comments`);
      setComments(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(`/documents/${documentId}/comments`, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolve = async (commentId: string) => {
    try {
      await api.put(`/documents/${documentId}/comments/${commentId}/resolve`);
      fetchComments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReply = async (commentId: string) => {
    const content = replyText[commentId];
    if (!content?.trim()) return;
    try {
      await api.post(`/documents/${documentId}/comments/${commentId}/replies`, { content });
      setReplyText(prev => ({ ...prev, [commentId]: '' }));
      fetchComments();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 text-gray-500 hover:bg-accent hover:text-indigo-600 focus:outline-none" title="Comments">
        <MessageSquare className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[500px] flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            Comments
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
          {comments.map((comment) => (
            <div key={comment.id} className={`bg-white border rounded-xl p-4 shadow-sm ${comment.resolved ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-[10px]">
                    {comment.user.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-semibold">{comment.user.name}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                {!comment.resolved && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-green-600" onClick={() => handleResolve(comment.id)}>
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-700 mb-3 ml-8">{comment.content}</p>

              {/* Replies */}
              {comment.replies?.length > 0 && (
                <div className="ml-8 pl-4 border-l-2 space-y-3 mb-3">
                  {comment.replies.map((reply: any) => (
                    <div key={reply.id}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">{reply.user.name}</span>
                        <span className="text-[10px] text-gray-400">
                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              {!comment.resolved && (
                <div className="ml-8 mt-2 flex items-center gap-2">
                  <Input 
                    placeholder="Reply..." 
                    className="h-8 text-xs"
                    value={replyText[comment.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleReply(comment.id)}
                  />
                  <Button size="icon" className="h-8 w-8 shrink-0" onClick={() => handleReply(comment.id)}>
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
          {comments.length === 0 && (
            <div className="text-center text-gray-500 py-12 italic text-sm">
              No comments yet. Start a discussion!
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Add a new comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <Button onClick={handleAddComment}>Post</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
