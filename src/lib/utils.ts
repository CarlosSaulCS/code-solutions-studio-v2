import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency with locale support
 */
export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount)
  } catch (error) {
    // Fallback for unsupported currencies or locales
    const symbol = currency === 'MXN' ? 'MX$' : '$'
    return `${symbol}${amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
}

/**
 * Format date with locale support
 */
export function formatDate(
  date: string | Date, 
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  locale: string = 'es-ES'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(locale, options)
}

/**
 * Validate email address using regex
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }
  
  const trimmedEmail = email.trim()
  
  // Basic checks
  if (trimmedEmail.length === 0) return false
  if (trimmedEmail.includes('..')) return false // No consecutive dots
  if (trimmedEmail.includes(' ')) return false // No spaces
  if (trimmedEmail.startsWith('@') || trimmedEmail.endsWith('@')) return false
  if (!trimmedEmail.includes('@') || trimmedEmail.split('@').length !== 2) return false
  
  // Check domain has at least one dot (TLD required)
  const [, domain] = trimmedEmail.split('@')
  if (!domain || !domain.includes('.')) return false
  
  // More comprehensive email validation regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  return emailRegex.test(trimmedEmail)
}

/**
 * Generate unique quote ID
 */
export function generateQuoteId(): string {
  const currentYear = new Date().getFullYear()
  const randomString = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `QUOTE-${currentYear}-${randomString}`
}
