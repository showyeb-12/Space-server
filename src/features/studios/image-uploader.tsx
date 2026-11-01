"use client";

import { useId, useRef, useState, type ChangeEvent } from "react";
import { ImageIcon, Link2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export function ImageUploader({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadFile(file: File) {
    if (!allowedTypes.includes(file.type)) {
      toast.error("Use a JPG, PNG, WebP, GIF, or AVIF image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Images must be 5 MB or smaller.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await api.post<{ url: string }>("/uploads", formData);
      onChange(response.data.url);
      toast.success("Image uploaded successfully.");
    } catch (uploadError) {
      toast.error(
        uploadError instanceof ApiError
          ? uploadError.message
          : "We could not upload that image. Try a URL instead.",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void uploadFile(file);
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-dashed border-base-content/15 bg-base-200/30">
        {value ? (
          <div className="relative aspect-[16/9] w-full bg-base-300">
            <div
              role="img"
              aria-label="Studio cover preview"
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${JSON.stringify(value)})` }}
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="truncate text-xs font-semibold text-white">
                Cover image
              </p>
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[0.68rem] font-semibold text-white backdrop-blur transition-colors hover:bg-white/25"
              >
                <X className="size-3" aria-hidden="true" />
                Remove
              </button>
            </div>
            {isUploading ? (
              <div className="absolute inset-0 grid place-items-center bg-black/45 backdrop-blur-sm">
                <span className="loading loading-spinner loading-lg text-white" />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-base-100 text-base-content/45 shadow-sm">
              {isUploading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <ImageIcon className="size-5" aria-hidden="true" />
              )}
            </span>
            <p className="mt-4 text-sm font-semibold">
              {isUploading ? "Uploading your image…" : "Add a cover image"}
            </p>
            <p className="mt-1 text-xs text-base-content/45">
              JPG, PNG, WebP, GIF, or AVIF. Up to 5 MB.
            </p>
            <label
              htmlFor={inputId}
              className={`mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-base-content/15 bg-base-100 px-4 py-2 text-xs font-semibold transition-colors hover:border-base-content/35 ${
                isUploading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              <UploadCloud className="size-3.5" aria-hidden="true" />
              Choose a file
            </label>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={allowedTypes.join(",")}
        onChange={handleFileChange}
        className="sr-only"
        disabled={isUploading}
      />

      <label
        htmlFor="studio-image-url"
        className="mt-4 mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-base-content/70"
      >
        <Link2 className="size-3.5" aria-hidden="true" />
        Or paste an image URL
      </label>
      <input
        id="studio-image-url"
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://images.unsplash.com/..."
        className="input input-bordered h-12 w-full rounded-xl border-base-content/10 bg-base-100 text-sm focus:border-base-content/30 focus:outline-none"
      />
      {error ? <p className="mt-1.5 text-xs font-medium text-error">{error}</p> : null}
    </div>
  );
}
