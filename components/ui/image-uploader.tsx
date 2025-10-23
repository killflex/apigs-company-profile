"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  className?: string;
  placeholder?: string;
}

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  accept = "image/*",
  className = "",
  placeholder = "Upload images or enter URLs",
}: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentImages = Array.isArray(value) ? value : value ? [value] : [];

  // Handle file selection
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Upload to Cloudinary via API
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const data = await response.json();
        newImages.push(data.url); // Use the Cloudinary URL
      }

      if (multiple) {
        const allImages = [...currentImages, ...newImages].slice(0, maxFiles);
        console.log(
          "ImageUploader: Calling onChange with multiple images:",
          allImages
        );
        onChange(allImages);
      } else {
        console.log(
          "ImageUploader: Calling onChange with single image:",
          newImages[0]
        );
        onChange(newImages[0]);
      }

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload image. Please try again.";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  // Add URL
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;

    if (multiple) {
      const allImages = [...currentImages, urlInput.trim()].slice(0, maxFiles);
      onChange(allImages);
    } else {
      onChange(urlInput.trim());
    }

    setUrlInput("");
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    if (multiple) {
      const newImages = currentImages.filter((_, i) => i !== index);
      onChange(newImages.length > 0 ? newImages : []);
    } else {
      onChange("");
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={triggerFileInput}
      >
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            {uploading ? (
              <div className="space-y-2">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">
                  Uploading images...
                </p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">{placeholder}</p>
                  <p className="text-xs text-muted-foreground">
                    Drag and drop files here, or click to browse
                  </p>
                  {multiple && (
                    <p className="text-xs text-muted-foreground">
                      Max {maxFiles} files
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* URL Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Or paste image URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
            className="pl-10"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddUrl}
          disabled={!urlInput.trim()}
        >
          Add URL
        </Button>
      </div>

      {/* Image Preview */}
      {currentImages.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {multiple ? "Selected Images" : "Selected Image"}
          </label>
          <div
            className={
              multiple
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                : ""
            }
          >
            {currentImages.map((imageUrl, index) => (
              <Card key={index} className="relative group overflow-hidden">
                <CardContent className="p-2">
                  <div className="relative aspect-video bg-muted rounded overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Show fallback on error
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove(
                            "hidden"
                          );
                        }}
                      />
                    ) : null}

                    {/* Fallback when image fails to load */}
                    <div className="absolute inset-0 bg-muted hidden items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>

                    {/* Remove button */}
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* URL display for reference */}
                  <p
                    className="text-xs text-muted-foreground mt-1 truncate"
                    title={imageUrl}
                  >
                    {imageUrl}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
