"use client";

// Floating edit-mode toggle — fixed top-right, above all content.
// When active, shows a hint + "Done" label. When idle, minimal pencil pill.

import { useEditMode } from "./EditModeContext";

export function EditModeToggle() {
  const { isEditing, toggleEdit, hydrated } = useEditMode();

  // Avoid flashing the wrong label during SSR hydration.
  if (!hydrated) return null;

  return (
    <div className="fixed top-4 right-4 md:top-5 md:right-6 z-[100] flex items-center gap-3">
      {isEditing && (
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-medium shadow-lg">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          Edit mode · click any image
        </span>
      )}
      <button
        type="button"
        onClick={toggleEdit}
        aria-pressed={isEditing}
        className={[
          "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm transition-colors",
          isEditing
            ? "bg-[var(--accent)] text-white hover:bg-[var(--foreground)]"
            : "bg-[var(--background)]/95 text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--accent)]",
        ].join(" ")}
      >
        {isEditing ? (
          <>
            <span aria-hidden>✓</span> Done
          </>
        ) : (
          <>
            <span aria-hidden>✏️</span> Edit
          </>
        )}
      </button>
    </div>
  );
}
