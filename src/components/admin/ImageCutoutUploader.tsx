import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, 
  Wand2, 
  RefreshCw, 
  Trash2, 
  Check, 
  Scissors, 
  Image as ImageIcon,
  Sliders
} from 'lucide-react';
import { useTheme } from '../../ThemeContext';

interface ImageCutoutUploaderProps {
  currentCutoutUrl?: string;
  currentOriginalUrl?: string;
  personName: string;
  paletteAccent?: string;
  onChange: (data: { cutoutUrl: string; originalPhotoUrl?: string }) => void;
}

export const ImageCutoutUploader: React.FC<ImageCutoutUploaderProps> = ({
  currentCutoutUrl,
  currentOriginalUrl,
  personName,
  paletteAccent = '#38B2A2',
  onChange,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [sourceImage, setSourceImage] = useState<string | null>(
    currentOriginalUrl || currentCutoutUrl || null
  );
  const [cutoutImage, setCutoutImage] = useState<string | null>(
    currentCutoutUrl || null
  );

  useEffect(() => {
    setSourceImage(currentOriginalUrl || currentCutoutUrl || null);
    setCutoutImage(currentCutoutUrl || null);
  }, [currentCutoutUrl, currentOriginalUrl]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [tolerance, setTolerance] = useState<number>(45);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Background removal logic
  const runBackgroundRemoval = useCallback(
    (customTolerance?: number) => {
      if (!sourceImage || !canvasRef.current) return;
      setIsProcessing(true);

      const tol = customTolerance ?? tolerance;
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          setIsProcessing(false);
          return;
        }
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        // Limit dimensions for high performance
        const maxDim = 800;
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        if (w > maxDim || h > maxDim) {
          const ratio = maxDim / Math.max(w, h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Sample the 4 outer corner pixels as background color
        const cornerIdxs = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + (w - 1)) * 4];
        let sumR = 0, sumG = 0, sumB = 0;
        cornerIdxs.forEach((idx) => {
          sumR += data[idx];
          sumG += data[idx + 1];
          sumB += data[idx + 2];
        });
        const targetR = Math.round(sumR / 4);
        const targetG = Math.round(sumG / 4);
        const targetB = Math.round(sumB / 4);

        const threshDist = (tol / 100) * 255;
        const ramp = 24;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const dist = Math.sqrt(
            (r - targetR) * (r - targetR) +
            (g - targetG) * (g - targetG) +
            (b - targetB) * (b - targetB)
          );

          if (dist < threshDist) {
            data[i + 3] = 0;
          } else if (dist < threshDist + ramp) {
            const norm = (dist - threshDist) / ramp;
            data[i + 3] = Math.round(norm * 255);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setCutoutImage(dataUrl);
        onChange({ cutoutUrl: dataUrl, originalPhotoUrl: sourceImage });
        setIsProcessing(false);
      };

      img.onerror = () => {
        setIsProcessing(false);
      };

      img.src = sourceImage;
    },
    [sourceImage, tolerance, onChange]
  );

  const handleFileProcess = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setSourceImage(dataUrl);

      // If file is already a transparent PNG or WebP, use it directly as cutout
      if (file.type === 'image/png' || file.type === 'image/webp') {
        setCutoutImage(dataUrl);
        onChange({ cutoutUrl: dataUrl, originalPhotoUrl: dataUrl });
      } else {
        // Automatically run background removal for JPEG photos
        setCutoutImage(null);
        setTimeout(() => {
          runBackgroundRemoval(45);
        }, 100);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileProcess(file);
    }
  };

  const handleRemove = () => {
    setSourceImage(null);
    setCutoutImage(null);
    onChange({ cutoutUrl: '', originalPhotoUrl: '' });
  };

  return (
    <div className="space-y-4">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Upload & Preview Workspace */}
      {!sourceImage ? (
        /* Empty Upload Dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center group flex flex-col items-center justify-center min-h-[220px] ${
            isDraggingOver
              ? 'border-[#38B2A2] bg-[#38B2A2]/10 scale-[1.01]'
              : isLight
              ? 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100/80 hover:border-zinc-400'
              : 'border-zinc-700 bg-zinc-900/40 hover:bg-zinc-800/40 hover:border-zinc-600'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileProcess(file);
            }}
          />

          <div className="w-14 h-14 rounded-2xl bg-[#38B2A2]/15 flex items-center justify-center text-[#235347] dark:text-[#38B2A2] mb-3 transition-transform group-hover:scale-110 shadow-xs">
            <Upload size={24} />
          </div>

          <div className="space-y-1">
            <div className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Drop a photo here
            </div>
            <div className="text-xs text-zinc-500">
              or <span className="text-[#38B2A2] font-semibold underline underline-offset-2">Browse files</span> from your computer
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-400 font-sans">
            <span>Supports JPG, PNG, WebP</span>
            <span>·</span>
            <span>Transparent PNGs supported directly</span>
          </div>
        </div>
      ) : (
        /* Image Loaded: Side-by-Side Original → Cut-Out Preview */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left: Original Photo */}
            <div className="md:col-span-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <ImageIcon size={13} />
                  <span>Original Photo</span>
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] text-[#38B2A2] hover:underline"
                >
                  Replace photo
                </button>
              </div>

              <div className="relative aspect-square max-h-[220px] mx-auto w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-black/5 flex items-center justify-center">
                <img
                  src={sourceImage}
                  alt="Original preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            {/* Right: Cut-Out Preview */}
            <div className="md:col-span-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Scissors size={13} style={{ color: paletteAccent }} />
                  <span>Isolated Silhouette</span>
                </span>
                {cutoutImage && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#38B2A2]/20 text-[#38B2A2] flex items-center gap-1">
                    <Check size={11} />
                    <span>Ready for Collage</span>
                  </span>
                )}
              </div>

              {/* Checkerboard transparency backdrop */}
              <div
                className="relative aspect-square max-h-[220px] mx-auto w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex items-center justify-center"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #e4e4e7 25%, transparent 25%), 
                    linear-gradient(-45deg, #e4e4e7 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #e4e4e7 75%), 
                    linear-gradient(-45deg, transparent 75%, #e4e4e7 75%)
                  `,
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                }}
              >
                {cutoutImage ? (
                  <img
                    src={cutoutImage}
                    alt={`${personName} cut-out`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  />
                ) : (
                  <div className="text-center p-4 text-zinc-400 text-xs">
                    Click "Remove Background" to isolate subject
                  </div>
                )}

                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold gap-2">
                    <RefreshCw size={15} className="animate-spin text-[#38B2A2]" />
                    <span>Isolating silhouette...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => runBackgroundRemoval()}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-[#163B32] hover:bg-[#235347] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Wand2 size={13} />
                <span>Remove Background</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors flex items-center gap-1.5"
              >
                <Sliders size={12} />
                <span>{showAdvanced ? 'Hide Fine-Tune' : 'Fine-Tune Edges'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors flex items-center gap-1"
            >
              <Trash2 size={12} />
              <span>Remove Photo</span>
            </button>
          </div>

          {/* Optional Fine-Tune Slider */}
          {showAdvanced && (
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <span>Background Sensitivity ({tolerance}%)</span>
                <span className="text-[11px] text-zinc-400">Increase if background remains</span>
              </div>
              <input
                type="range"
                min="10"
                max="85"
                value={tolerance}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTolerance(val);
                  runBackgroundRemoval(val);
                }}
                className="w-full accent-[#38B2A2] cursor-pointer"
              />
            </div>
          )}

          {/* Quick Preset Selector for Lab Builders */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Quick Pick Existing Lab Cutout:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'Ekansh G.', file: '/cutouts/ekansh.png' },
                { name: 'Dev P.', file: '/cutouts/dev.png' },
                { name: 'Sneha T.', file: '/cutouts/sneha.png' },
                { name: 'Meera R.', file: '/cutouts/meera.png' },
                { name: 'Vikram S.', file: '/cutouts/vikram.png' },
                { name: 'Arjun M.', file: '/cutouts/arjun.png' },
                { name: 'Tanya L.', file: '/cutouts/tanya.png' },
                { name: 'Rohan K.', file: '/cutouts/rohan.png' },
                { name: 'Aditya N.', file: '/cutouts/aditya.png' },
              ].map((p) => (
                <button
                  key={p.file}
                  type="button"
                  onClick={() => {
                    setCutoutImage(p.file);
                    setSourceImage(p.file);
                    onChange({ cutoutUrl: p.file, originalPhotoUrl: p.file });
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs border border-zinc-200 dark:border-zinc-700 hover:border-[#38B2A2] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input when image is already loaded */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileProcess(file);
        }}
      />
    </div>
  );
};
