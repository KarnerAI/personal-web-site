"use client";

// Edit mode context — client-side authoring for image slots.
// Stores per-slot overrides (uploaded src + crop position) in LocalStorage.
// Survives reload in the same browser. For permanent changes, user downloads
// the cropped file from the EditableImage toolbar and drops it into public/.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ImageOverride = {
  /** Data URL (user upload) or external URL. If undefined, falls back to defaultSrc. */
  src?: string;
  /** Background-position X, 0–100. If undefined, falls back to defaultPositionX. */
  positionX?: number;
  /** Background-position Y, 0–100. If undefined, falls back to defaultPositionY. */
  positionY?: number;
};

type Overrides = Record<string, ImageOverride>;

type EditModeContextValue = {
  isEditing: boolean;
  toggleEdit: () => void;
  overrides: Overrides;
  setOverride: (slotId: string, patch: ImageOverride) => void;
  resetOverride: (slotId: string) => void;
  /** True once LocalStorage has been read post-mount. Prevents SSR/CSR mismatch. */
  hydrated: boolean;
};

const EditModeContext = createContext<EditModeContextValue | null>(null);

const STORAGE_KEY = "hussain-portfolio-edits-v1";

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from LocalStorage after mount (SSR-safe).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Overrides;
        setOverrides(parsed);
      }
    } catch {
      // Corrupt storage — ignore.
    }
    setHydrated(true);
  }, []);

  // Persist on change.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {
      // Quota full or private mode — silently drop.
    }
  }, [overrides, hydrated]);

  const toggleEdit = useCallback(() => setIsEditing((v) => !v), []);

  const setOverride = useCallback((slotId: string, patch: ImageOverride) => {
    setOverrides((prev) => ({
      ...prev,
      [slotId]: { ...prev[slotId], ...patch },
    }));
  }, []);

  const resetOverride = useCallback((slotId: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  }, []);

  const value = useMemo<EditModeContextValue>(
    () => ({ isEditing, toggleEdit, overrides, setOverride, resetOverride, hydrated }),
    [isEditing, toggleEdit, overrides, setOverride, resetOverride, hydrated]
  );

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}

export function useEditMode() {
  const ctx = useContext(EditModeContext);
  if (!ctx) {
    throw new Error("useEditMode must be used inside <EditModeProvider>");
  }
  return ctx;
}
