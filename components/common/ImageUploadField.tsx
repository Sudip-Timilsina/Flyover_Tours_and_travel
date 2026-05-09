"use client";

import { useId, useState } from "react";
import { Upload, X } from "lucide-react";

type ImageUploadFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  dark?: boolean;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

async function compressImage(file: File): Promise<string> {
  // Check file size first
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size must be less than 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        if (!result || result.length === 0) {
          reject(new Error("Failed to read image file"));
          return;
        }

        const img = new Image();
        img.onload = () => {
          try {
            // Create canvas for resizing
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions if image is too large
            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
              const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Failed to get canvas context"));
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Try multiple formats
            let dataUrl = "";
            
            try {
              // First try WebP
              const webpUrl = canvas.toDataURL("image/webp", 0.85);
              if (webpUrl && webpUrl.length > 100) {
                dataUrl = webpUrl;
              }
            } catch {
              // WebP not supported
            }

            // Fallback to JPEG
            if (!dataUrl) {
              try {
                const jpegUrl = canvas.toDataURL("image/jpeg", 0.85);
                if (jpegUrl && jpegUrl.length > 100) {
                  dataUrl = jpegUrl;
                }
              } catch {
                // JPEG failed
              }
            }

            // Last resort: use PNG
            if (!dataUrl) {
              dataUrl = canvas.toDataURL("image/png");
            }

            // If still no valid data URL, use original
            if (!dataUrl || dataUrl.length < 100) {
              dataUrl = result;
            }

            // Check if compressed data URL is too large
            if (dataUrl.length > MAX_FILE_SIZE * 1.3) {
              reject(new Error("Image is too large even after compression. Please use a smaller image."));
              return;
            }

            resolve(dataUrl);
          } catch (err: any) {
            // If compression fails, fallback to original
            console.warn("Compression failed, using original image:", err);
            if (result.length > MAX_FILE_SIZE * 1.3) {
              reject(new Error("Image is too large. Please use a smaller image."));
            } else {
              resolve(result);
            }
          }
        };
        img.onerror = () => {
          // If image fails to load, try using the original data URL
          console.warn("Image loading failed, using original data URL");
          if (result.length > MAX_FILE_SIZE * 1.3) {
            reject(new Error("Image is too large. Please use a smaller image."));
          } else {
            resolve(result);
          }
        };
        img.src = result;
      } catch (err: any) {
        reject(new Error(`Image processing error: ${err.message}`));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    try {
      reader.readAsDataURL(file);
    } catch (err: any) {
      reject(new Error(`File reading error: ${err.message}`));
    }
  });
}

export function ImageUploadField({
  label,
  name,
  value,
  onChange,
  helperText,
  dark = false,
}: ImageUploadFieldProps) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPEG, GIF, WebP, etc.)");
      event.target.value = "";
      return;
    }

    setUploading(true);
    setError("");
    
    try {
      const dataUrl = await compressImage(file);
      onChange(dataUrl);
      setError("");
    } catch (err: any) {
      console.error("Image upload error:", err);
      setError(err.message || "Failed to process image. Please try another file.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        className={dark ? "mb-2 block text-sm font-semibold text-slate-200" : "mb-2 block text-sm font-semibold text-slate-700"}
      >
        {label}
      </label>

      {error && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {value ? (
        <div className={dark ? "rounded-3xl border border-white/10 bg-white/5 p-4 max-w-sm" : "rounded-3xl border border-slate-200 bg-white p-4 max-w-sm"}>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-100 aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className="h-full w-full object-cover" onError={(e) => {
              console.error("Image failed to load:", value);
              e.currentTarget.src = "";
            }} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label
              htmlFor={inputId}
              className={dark ? "inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100" : "inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"}
            >
              <Upload className="h-4 w-4" />
              Replace image
            </label>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setError("");
              }}
              className={dark ? "inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10" : "inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"}
            >
              <X className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={dark ? "flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-8 text-center transition hover:bg-white/10" : "flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:bg-slate-100"}
        >
          <Upload className={dark ? "h-6 w-6 text-accent-300" : "h-6 w-6 text-primary-600"} />
          <span className={dark ? "mt-3 text-sm font-semibold text-slate-100" : "mt-3 text-sm font-semibold text-slate-700"}>
            {uploading ? "Processing image..." : "Choose image to upload"}
          </span>
          {helperText ? (
            <span className={dark ? "mt-2 text-xs text-slate-300" : "mt-2 text-xs text-slate-500"}>{helperText}</span>
          ) : (
            <span className={dark ? "mt-2 text-xs text-slate-400" : "mt-2 text-xs text-slate-500"}>Max 5MB • Auto-compressed to 1920×1080</span>
          )}
        </label>
      )}

      <input id={inputId} name={name} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  );
}