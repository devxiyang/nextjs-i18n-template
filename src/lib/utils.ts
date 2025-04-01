import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number with thousands separator
 * @param value - The number to format
 * @param defaultValue - The default value to return if value is undefined or not a number
 * @returns Formatted number string
 */
export function formatNumber(value?: number, defaultValue: string = "-"): string {
  if (value === undefined || value === null || isNaN(value)) {
    return defaultValue;
  }
  
  return new Intl.NumberFormat().format(value);
}
