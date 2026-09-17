import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, RefreshCw, Check } from 'lucide-react';
import { useTheme } from '../../ThemeContext';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageChange: (dataUrl: string | undefined, dimensions?: string) => void;
  aspectRatio?: 'portrait' | 'square' | 'landscape';
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageChange,
  aspectRatio = 'portrait',
  className = '',
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageMeta, setImageMeta] = useState<string | undefined>(undefined);

  // Compress and optimize image using HTML5 Canvas
  const processImageFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file (JPEG, PNG, WEBP).');
        return;
      }

      setIsProcessing(true);
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;
        const img = new Image();

        img.onload = () => {
          // Client-side optimization: scale down large images to max 1200px to avoid memory & storage issues
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Export optimized JPEG at 85% quality
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            const approxKb = Math.round((optimizedDataUrl.length * 3) / 4 / 1024);
            const meta = `${width}×${height}px · ~${approxKb} KB`;

            setPreviewUrl(optimizedDataUrl);
            setImageMeta(meta);
            onImageChange(optimizedDataUrl, meta);
          } else {
            setPreviewUrl(result);
            onImageChange(result);
          }
          setIsProcessing(false);
        };

        img.onerror = () => {
          setIsProcessing(false);
          alert('Failed to decode image.');
        };

        img.src = result;
      };

      reader.readAsDataURL(file);
    },
    [onImageChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(undefined);
    setImageMeta(undefined);
    onImageChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'landscape'
      ? 'aspect-[16/10]'
      : 'aspect-[4/5]';

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Main Dropzone / Preview Area */}
      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-700 group shadow-sm bg-black/5">
          <div className={`w-full ${aspectClass} relative`}>
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
            />
            {/* Hover Actions Bar */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-100 transition-colors flex items-center gap-1.5 shadow-md"
              >
                <RefreshCw size={13} />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors flex items-center gap-1.5 shadow-md"
              >
                <X size={13} />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="p-2.5 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
            <div className="flex items-center gap-1 text-[#235347] font-semibold">
              <Check size={13} />
              <span>Optimized & Ready</span>
            </div>
            {imageMeta && <span>{imageMeta}</span>}
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full ${aspectClass} rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-[#235347] bg-[#235347]/10 scale-[1.01]'
              : isLight
              ? 'border-zinc-300 hover:border-[#235347] bg-zinc-50/70 hover:bg-zinc-100/70 text-zinc-600'
              : 'border-zinc-700 hover:border-[#99CDD8] bg-zinc-900/50 hover:bg-zinc-900 text-zinc-400'
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2">
              <RefreshCw size={24} className="animate-spin text-[#235347]" />
              <span className="text-xs font-medium">Optimizing portrait...</span>
            </div>
          ) : (
            <div className="space-y-3 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#235347]/10 flex items-center justify-center text-[#235347]">
                <Upload size={20} />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-0.5">
                  Drag portrait here, or click to browse
                </div>
                <div className="text-[11px] text-zinc-500">
                  PNG, JPG or WEBP · Automatically optimized for web
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
