import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  /**
   * Generate a unique ID
   */
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Validate file type and size
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    const { FILE_UPLOAD } = APP_CONSTANTS;

    // Check file size
    if (file.size > FILE_UPLOAD.MAX_SIZE) {
      return {
        isValid: false,
        error: `קובץ גדול מדי. גודל מקסימלי: ${
          FILE_UPLOAD.MAX_SIZE / 1024 / 1024
        }MB`,
      };
    }

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (
      !fileExtension ||
      !FILE_UPLOAD.ALLOWED_TYPES.includes(fileExtension as any)
    ) {
      return {
        isValid: false,
        error: `סוג קובץ לא נתמך. סוגים נתמכים: ${FILE_UPLOAD.ALLOWED_TYPES.join(
          ', '
        )}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Format date to Hebrew locale
   */
  formatDate(date: Date): string {
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  /**
   * Format currency in Israeli Shekel
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
    }).format(amount);
  }

  /**
   * Calculate average monthly revenue
   */
  calculateMonthlyRevenue(totalRevenue: number): number {
    return Math.floor(totalRevenue / 12);
  }

  /**
   * Deep clone an object
   */
  deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Check if object is empty
   */
  isEmpty(obj: any): boolean {
    return (
      obj === null ||
      obj === undefined ||
      (typeof obj === 'object' && Object.keys(obj).length === 0) ||
      (typeof obj === 'string' && obj.trim() === '')
    );
  }

  /**
   * Debounce function execution
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: any;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
}
