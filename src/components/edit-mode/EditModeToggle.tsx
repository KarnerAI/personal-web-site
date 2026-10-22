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
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ink)] text-[var(--page)] text-xs font-medium shadow-lg">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
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
            ? "bg-[var(--primary)] text-white hover:bg-[var(--ink)]"
            : "bg-[var(--page)]/95 text-[var(--ink)] border border-[var(--line)] hover:border-[var(--primary)]",
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
