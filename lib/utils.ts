import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes Persian/Arabic digits to standard ASCII numerals
 * Example: "۰۹۱۲۳۴۵۶۷۸۹" -> "09123456789"
 */
export function normalizeDigits(input: string): string {
  if (!input) return "";
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

  let result = input;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persianDigits[i], "g"), i.toString());
    result = result.replace(new RegExp(arabicDigits[i], "g"), i.toString());
  }
  return result;
}

/**
 * Formats a date into Persian Jalali string
 */
export function formatPersianDate(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/**
 * Formats file size in bytes into human readable Persian format
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} بایت`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} کیلوبایت`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} مگابایت`;
}
