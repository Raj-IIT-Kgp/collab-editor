'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState, useRef } from 'react';
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, INSERT_CHECK_LIST_COMMAND } from '@lexical/list';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Underline, Strikethrough, Undo, Redo, 
  Heading1, Heading2, Heading3, Quote, List, ListOrdered, CheckSquare, Image as ImageIcon
} from 'lucide-react';
import { INSERT_IMAGE_COMMAND } from './plugins/ImagePlugin';
import { api } from '@/lib/api';
import axios from 'axios';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const formatHeading = (headingSize: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Get presigned URL
      const { data } = await api.post('/uploads/presigned-url', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      // Upload directly to S3
      await axios.put(data.uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      // Insert image node
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        src: data.fileUrl,
        altText: file.name,
      });
    } catch (error) {
      console.error('Failed to upload image', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} title="Undo">
        <Undo className="h-4 w-4 text-gray-700" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} title="Redo">
        <Redo className="h-4 w-4 text-gray-700" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button variant="ghost" size="icon" onClick={() => formatHeading('h1')} title="Heading 1">
        <Heading1 className="h-4 w-4 text-gray-700" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => formatHeading('h2')} title="Heading 2">
        <Heading2 className="h-4 w-4 text-gray-700" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => formatHeading('h3')} title="Heading 3">
        <Heading3 className="h-4 w-4 text-gray-700" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} title="Bold">
        <Bold className="h-4 w-4 text-gray-700" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} title="Italic">
        <Italic className="h-4 w-4 text-gray-700" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} title="Underline">
        <Underline className="h-4 w-4 text-gray-700" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')} title="Strikethrough">
        <Strikethrough className="h-4 w-4 text-gray-700" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} title="Bullet List">
        <List className="h-4 w-4 text-gray-700" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} title="Numbered List">
        <ListOrdered className="h-4 w-4 text-gray-700" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)} title="Checklist">
        <CheckSquare className="h-4 w-4 text-gray-700" />
      </Button>
      <Button variant="ghost" size="icon" onClick={formatQuote} title="Quote">
        <Quote className="h-4 w-4 text-gray-700" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => fileInputRef.current?.click()} 
        title="Insert Image"
        disabled={isUploading}
      >
        <ImageIcon className={`h-4 w-4 text-gray-700 ${isUploading ? 'opacity-50 animate-pulse' : ''}`} />
      </Button>
    </div>
  );
}

