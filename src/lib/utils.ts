import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to get the error message for a field from the validation errors
export function getFieldError(formErrors: Record<string, string[]>, field: string) {
  return formErrors?.[field]?.join(", ");
}
