"use client";

import { useState } from "react";
import { Expand } from "lucide-react";
import type { GalleryCategory, GalleryItem } from "@/types/gallery";
import { galleryCategoryLabels } from "@/data/gallery";
import { ResortImage } from "@/components/ui/ResortImage";
import { Lightbox } from "./Lightbox";

interface GalleryBrowserProps {
  items: readonly GalleryItem[];
}

const filters: { value: GalleryCategory | null; label: string }[] = [
  { value: null, label: "All" },
  ...(Object.entries(galleryCategoryLabels) as [GalleryCategory, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
];

/**
 * Category filter, masonry grid and lightbox. Each photo is a button, so the grid is
 * fully keyboard operable; the lightbox pages through the current filter only.
 */
export function GalleryBrowser({ items }: GalleryBrowserProps) {
  const [category, setCategory] = useState<GalleryCategory | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visible = items.filter((item) => category === null || item.category === category);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-y border-line py-6">
        <fieldset>
          <legend className="mb-2.5 text-xs font-medium tracking-[0.14em] text-muted uppercase">
            Show
          </legend>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <label
                key={filter.label}
                className="inline-flex h-11 cursor-pointer items-center rounded-sm border border-line-strong px-4 text-sm transition-colors select-none hover:border-forest-800 has-checked:border-forest-800 has-checked:bg-forest-800 has-checked:text-ivory has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--focus-ring)"
              >
                <input
                  type="radio"
                  name="gallery-category"
                  className="sr-only"
                  checked={category === filter.value}
                  onChange={() => setCategory(filter.value)}
                />
                {filter.label}
              </label>
            ))}
          </div>
        </fieldset>
        {/* As tall as the filter chips, so the count sits on their centre line. */}
        <p role="status" className="flex h-11 items-center text-sm text-muted">
          {visible.length} photographs
        </p>
      </div>

      <ul className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 lg:gap-6">
        {visible.map((item, index) => (
          <li key={item.asset.id} className="mb-4 break-inside-avoid lg:mb-6">
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`View larger: ${item.asset.alt}`}
              className="group relative block w-full overflow-hidden bg-sand focus-visible:outline-offset-4"
            >
              <ResortImage
                asset={item.asset}
                sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 50vw, 100vw"
                className="h-auto w-full transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
              />
              <span
                aria-hidden="true"
                className="absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-full bg-forest-900/70 text-ivory opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <Expand className="size-4" strokeWidth={1.5} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        items={visible}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
