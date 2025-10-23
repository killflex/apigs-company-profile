"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "./textarea";
import { Label } from "./label";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Edit3,
} from "lucide-react";

interface SimpleTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

export default function SimpleTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  className = "",
  label = "Content",
}: SimpleTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const insertText = (before: string, after = "") => {
    const textarea = document.querySelector(
      'textarea[data-editor="true"]'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatText = (type: string) => {
    switch (type) {
      case "bold":
        insertText("**", "**");
        break;
      case "italic":
        insertText("*", "*");
        break;
      case "link":
        insertText("[", "](https://example.com)");
        break;
      case "image":
        insertText("![Alt text](", ")");
        break;
      case "list":
        insertText("\n- ");
        break;
      case "orderedList":
        insertText("\n1. ");
        break;
      default:
        break;
    }
  };

  const renderPreview = (text: string) => {
    // Simple markdown-like rendering
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>'
      )
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded" />'
      )
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/^(\d+)\. (.+)$/gm, "<li>$1. $2</li>")
      .replace(/\n/g, "<br>");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label htmlFor="content-editor">{label}</Label>}

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border border-border rounded-lg bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("list")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("link")}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("image")}
          title="Add Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <div className="flex-1" />

        <Button
          type="button"
          variant={isPreview ? "default" : "ghost"}
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          title={isPreview ? "Edit" : "Preview"}
        >
          {isPreview ? (
            <Edit3 className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Content Area */}
      {isPreview ? (
        <div
          className="min-h-[200px] p-4 border border-border rounded-lg bg-background prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
        />
      ) : (
        <Textarea
          id="content-editor"
          data-editor="true"
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="min-h-[200px] font-mono text-sm"
        />
      )}

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground">
        Supports basic markdown: **bold**, *italic*, [links](url),
        ![images](url), - lists
      </p>
    </div>
  );
}
