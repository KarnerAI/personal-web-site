"use client";

// EditableImage — drop-in replacement for a background-image <div>.
// Default: renders the image like any styled div (matches existing pattern so
// it fails silently if the file is missing; children render through as fallback).
// In edit mode: dotted outline + mini toolbar (Replace / Reset / Download)
// and pointer-drag to reposition the crop (updates background-position live).

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useEditMode } from "./EditModeContext";

type Props = {
  /** Stable key for LocalStorage. Must be unique per image on the page. */
  slotId: string;
  /** Fallback image URL when user hasn't uploaded an override. */
  defaultSrc: string;
  /** Default background-position X, 0–100. Defaults to 50. */
  defaultPositionX?: number;
  /** Default background-position Y, 0–100. Defaults to 50. */
  defaultPositionY?: number;
  /** Outer className — controls the rendered size and border radius. */
  className?: string;
  /** Merged onto the element. Use for things like rings / shadows. */
  style?: CSSProperties;
  /** Required for a11y — screen readers announce this. */
  ariaLabel: string;
  /**
   * Fallback content rendered INSIDE the element (e.g. the "HA" monogram).
   * Shows through when the background image fails or is absent.
   */
  children?: React.ReactNode;
  /**
   * Export dimensions (pixels). Defaults to a reasonable size for the slot shape.
   * Hero cover: use something like { w: 1920, h: 680 }. Portrait: { w: 1024, h: 1024 }.
   */
  exportSize?: { w: number; h: number };
};

export function EditableImage({
  slotId,
  defaultSrc,
  defaultPositionX = 50,
  defaultPositionY = 50,
  className,
  style,
  ariaLabel,
  children,
  exportSize = { w: 1600, h: 1600 },
}: Props) {
  const { isEditing, overrides, setOverride, resetOverride, hydrated } =
    useEditMode();
  const override = overrides[slotId];

  // Resolved values — override first, then defaults.
  const src = override?.src ?? defaultSrc;
  const posX = override?.positionX ?? defaultPositionX;
  const posY = override?.positionY ?? defaultPositionY;

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; posX: number; posY: number } | null>(
    null
  );

  // File upload → read as data URL → stash in overrides.
  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setOverride(slotId, { src: result });
        }
      };
      reader.readAsDataURL(file);
    },
    [setOverride, slotId]
  );

  const onPickFile = () => fileInputRef.current?.click();

  // Drag-to-reposition. Dragging right reveals MORE of the left side of the image,
  // which means background-position X decreases (pinning more of image's left edge).
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isEditing) return;
    // Don't start drag if clicking on a toolbar button.
    const target = e.target as HTMLElement;
    if (target.closest("[data-toolbar]")) return;
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY, posX: posX, posY: posY };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const onMove = (e: PointerEvent) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      // Drag 100% of container shifts position by ~100% (intuitive pan feel).
      const nextX = clamp(dragStart.current.posX - (dx / rect.width) * 100);
      const nextY = clamp(dragStart.current.posY - (dy / rect.height) * 100);
      setOverride(slotId, { positionX: nextX, positionY: nextY });
    };
    const onUp = () => {
      setDragging(false);
      dragStart.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, slotId, setOverride]);

  // Export the current crop as a JPG, matching what the user sees.
  // Replicates background-size: cover + background-position on a canvas.
  const onDownload = async () => {
    const img = new Image();
    // Works for data URLs. For external URLs like Unsplash, they send CORS headers.
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = exportSize.w;
      canvas.height = exportSize.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const cW = canvas.width;
      const cH = canvas.height;
      const imgAspect = img.width / img.height;
      const canvasAspect = cW / cH;
      let drawW: number;
      let drawH: number;
      let dx: number;
      let dy: number;
      if (imgAspect > canvasAspect) {
        // Image is wider → fill height, overflow horizontally.
        drawH = cH;
        drawW = drawH * imgAspect;
        dy = 0;
        dx = -((drawW - cW) * posX) / 100;
      } else {
        drawW = cW;
        drawH = drawW / imgAspect;
        dx = 0;
        dy = -((drawH - cH) * posY) / 100;
      }
      ctx.drawImage(img, dx, dy, drawW, drawH);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${slotId}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        },
        "image/jpeg",
        0.92
      );
    };
    img.onerror = () => {
      alert(
        "Couldn't export this image. If it's loaded from a URL without CORS headers, upload a local copy first."
      );
    };
    img.src = src;
  };

  // During SSR/pre-hydration render, show the default (no override leak to static HTML).
  const effectiveSrc = hydrated ? src : defaultSrc;
  const effectivePosX = hydrated ? posX : defaultPositionX;
  const effectivePosY = hydrated ? posY : defaultPositionY;

  const editingClass = isEditing
    ? "outline-dashed outline-2 outline-offset-2 outline-[var(--accent)] cursor-grab active:cursor-grabbing"
    : "";

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      onPointerDown={onPointerDown}
      className={[className, editingClass, "relative bg-cover"].filter(Boolean).join(" ")}
      style={{
        ...style,
        backgroundImage: `url('${effectiveSrc}')`,
        backgroundPosition: `${effectivePosX}% ${effectivePosY}%`,
        touchAction: isEditing ? "none" : undefined,
      }}
    >
      {children}

      {isEditing && hydrated && (
        <div
          data-toolbar
          className="absolute top-2 right-2 z-20 flex items-center gap-1 rounded-full bg-[var(--foreground)]/95 text-[var(--background)] text-[11px] font-medium px-1 py-1 shadow-xl backdrop-blur-sm"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <ToolbarButton onClick={onPickFile} label="Replace image">
            <span aria-hidden>📷</span> Replace
          </ToolbarButton>
          <ToolbarButton onClick={onDownload} label="Download cropped image">
            <span aria-hidden>⬇</span> Export
          </ToolbarButton>
          {override && (
            <ToolbarButton
              onClick={() => resetOverride(slotId)}
              label="Reset to default"
            >
              <span aria-hidden>↺</span> Reset
            </ToolbarButton>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          // Reset so re-picking the same file fires change.
          e.target.value = "";
        }}
      />
    </div>
  );
}

function ToolbarButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-white/10 transition-colors"
    >
      {children}
    </button>
  );
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}
