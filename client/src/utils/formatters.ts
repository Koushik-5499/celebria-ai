/**
 * Currency and date formatting utilities for Celebria AI
 */

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  AED: 'AED ',
  SGD: 'S$',
};

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || `${currency} `;
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount || 0);

  return `${symbol}${formattedNumber}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getDaysRemaining(targetDate: string): {
  days: number;
  text: string;
  isPast: boolean;
  isToday: boolean;
} {
  if (!targetDate) return { days: 0, text: 'No date', isPast: false, isToday: false };

  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { days: 0, text: 'Today!', isPast: false, isToday: true };
  } else if (diffDays < 0) {
    return { days: Math.abs(diffDays), text: `${Math.abs(diffDays)}d ago`, isPast: true, isToday: false };
  } else {
    return { days: diffDays, text: `In ${diffDays} days`, isPast: false, isToday: false };
  }
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
