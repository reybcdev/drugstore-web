import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isAfter, isBefore, addDays } from "date-fns"
import { INVENTORY_CONSTANTS } from "../types/inventory"

/**
 * Combines class names with Tailwind merge
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date as a human-readable string
 * @param date - Date to format
 * @param formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatStr)
}

/**
 * Formats a number as USD currency
 * @param amount - Number to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Checks if a product is considered low in stock
 * @param quantity - Current stock quantity
 * @param threshold - Minimum threshold (default from constants)
 * @returns True if stock is low
 */
export function isLowStock(quantity: number, threshold: number = INVENTORY_CONSTANTS.DEFAULT_MIN_STOCK): boolean {
  return quantity > 0 && quantity <= threshold
}

/**
 * Checks if a product is expiring soon
 * @param expiryDate - Product expiration date
 * @param daysThreshold - Days threshold (default from constants)
 * @returns True if expiring soon
 */
export function isExpiringSoon(expiryDate: string | Date, daysThreshold: number = INVENTORY_CONSTANTS.EXPIRING_SOON_DAYS): boolean {
  const today = new Date()
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate
  const thresholdDate = addDays(today, daysThreshold)
  
  return isAfter(expiry, today) && isBefore(expiry, thresholdDate)
}

/**
 * Checks if a product is expired
 * @param expiryDate - Product expiration date
 * @returns True if expired
 */
export function isExpired(expiryDate: string | Date): boolean {
  const today = new Date()
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate
  
  return isBefore(expiry, today)
}

/**
 * Converts snake_case strings to camelCase
 * @param str - Snake case string
 * @returns Camel case string
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Converts camelCase strings to snake_case
 * @param str - Camel case string
 * @returns Snake case string
 */
export function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`)
}