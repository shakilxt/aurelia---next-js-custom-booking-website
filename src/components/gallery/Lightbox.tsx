"use client";

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/types/gallery";
import { galleryCategoryLabels } from "@/data/gallery";

interface LightboxProps {
  items: readonly GalleryItem[];
  /** Index of the image on show, or null when closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 48;

const navButton =
  "absolute top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-forest-900/70 text-ivory transition-colors hover:bg-forest-900";

/**
 * Full-screen photo viewer on the native <dialog>: focus containment, Escape and focus
 * return come from the browser. Arrow keys and touch swipes move between images, and
 * the caption is a live region so each change is announced.
 */
export function Lightbox({ items, index, onIndexChange, onClose }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const swipeStart = useRef<number | null>(null);
  const open = index !== null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const item = index !== null ? items[index] : undefined;
  const step = (delta: number) => {
    if (index === null) return;
    onIndexChange((index + delta + items.length) % items.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
    else return;
    event.preventDefault();
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") swipeStart.current = event.clientX;
  };
  const handlePointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) >= SWIPE_THRESHOLD) step(distance < 0 ? 1 : -1);
  };

  return (
    <dialog
      ref={ref}
      aria-label="Photo viewer"
      onClose={onClose}
      onKeyDown={handleKeyDown}
      data-surface="dark"
      className="lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-forest-900 p-0 text-ivory backdrop:bg-forest-900"
    >
      {item && index !== null ? (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="text-sm text-ivory/80 tabular-nums">
              {index + 1} / {items.length}
              <span className="ml-3 text-xs tracking-[0.14em] text-gold uppercase">
                {galleryCategoryLabels[item.category]}
              </span>
            </p>
            <button
              type="button"
              aria-label="Close photo viewer"
              onClick={() => ref.current?.close()}
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-sm hover:bg-forest-800"
            >
              <X aria-hidden="true" className="size-6" strokeWidth={1.5} />
            </button>
          </div>

          <div
            className="relative min-h-0 flex-1 touch-pan-y"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => (swipeStart.current = null)}
          >
            <div className="absolute inset-0 sm:inset-x-20">
              {/* Inline objectFit lets next/image size the blur placeholder to match. */}
              <Image
                key={item.asset.id}
                src={item.asset.src}
                alt={item.asset.alt}
                fill
                sizes="(min-width: 40rem) calc(100vw - 10rem), 100vw"
                placeholder="blur"
                style={{ objectFit: "contain" }}
              />
            </div>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => step(-1)}
              className={`${navButton} left-3 sm:left-6`}
            >
              <ChevronLeft aria-hidden="true" className="size-6" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => step(1)}
              className={`${navButton} right-3 sm:right-6`}
            >
              <ChevronRight aria-hidden="true" className="size-6" strokeWidth={1.5} />
            </button>
          </div>

          <p
            aria-live="polite"
            className="mx-auto max-w-3xl px-6 pt-4 pb-6 text-center text-sm text-ivory/85 sm:pb-8"
          >
            <span className="sr-only">
              Photo {index + 1} of {items.length}:{" "}
            </span>
            {item.asset.alt}
          </p>
        </div>
      ) : null}
    </dialog>
  );
}
