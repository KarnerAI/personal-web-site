import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with conflict resolution.
 * Usage: cn("px-2 py-1", condition && "bg-red-500", props.className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
