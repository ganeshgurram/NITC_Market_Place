import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a date string or timestamp into a user-friendly format
// Example: "2 hours ago", "Yesterday at 3:45 PM", "October 15"
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const diffMinutes = Math.floor(diff / 60000);
  const diffHours = Math.floor(diff / 3600000);
  const diffDays = Math.floor(diff / 86400000);

  // If less than 1 minute ago
  if (diffMinutes < 1) {
    return 'Just now';
  }
  
  // If less than 1 hour ago
  if (diffHours < 1) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  // If less than 24 hours ago
  if (diffDays < 1) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  }

  // If yesterday
  if (diffDays === 1) {
    return `Yesterday at ${d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }

  // If less than 7 days ago
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  // If this year
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleString('en-US', { month: 'long', day: 'numeric' });
  }

  // If different year
  return d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
