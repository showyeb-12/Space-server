"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Studio } from "@/types";

export function GalleryCarousel({ studio }: { studio: Studio }) {
  const images = Array.from(
    new Set([studio.imageUrl, ...studio.gallery].filter(Boolean)),
  );
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[1.5rem] bg-base-300 sm:aspect-[16/9]">
        <Image
          src={images[activeIndex] ?? studio.imageUrl}
          alt={`${studio.title} — photo ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover"
        />
        <span className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1.5 text-[0.68rem] font-semibold text-white backdrop-blur">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 ? (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-opacity",
                activeIndex === index
                  ? "border-primary opacity-100"
                  : "border-transparent opacity-55 hover:opacity-85",
              )}
              aria-label={`View photo ${index + 1}`}
              aria-pressed={activeIndex === index}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
