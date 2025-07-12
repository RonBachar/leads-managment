import { Injectable } from '@angular/core';
import { Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  private readonly VALIDATION = APP_CONSTANTS.VALIDATION;

  /**
   * Get lead form validators
   */
  getLeadValidators() {
    return {
      firstName: [
        Validators.required,
        Validators.minLength(this.VALIDATION.MIN_NAME_LENGTH),
        Validators.maxLength(this.VALIDATION.MAX_NAME_LENGTH),
      ],
      lastName: [
        Validators.required,
        Validators.minLength(this.VALIDATION.MIN_NAME_LENGTH),
        Validators.maxLength(this.VALIDATION.MAX_NAME_LENGTH),
      ],
      email: [Validators.email],
      phone: [
        Validators.required,
        Validators.pattern(this.VALIDATION.PHONE_PATTERN),
      ],
      source: [Validators.required],
      status: [Validators.required],
      notes: [],
    };
  }

  /**
   * Get client form validators
   */
  getClientValidators() {
    return {
      firstName: [
        Validators.required,
        Validators.minLength(this.VALIDATION.MIN_NAME_LENGTH),
        Validators.maxLength(this.VALIDATION.MAX_NAME_LENGTH),
      ],
      lastName: [
        Validators.required,
        Validators.minLength(this.VALIDATION.MIN_NAME_LENGTH),
        Validators.maxLength(this.VALIDATION.MAX_NAME_LENGTH),
      ],
      email: [Validators.required, Validators.email],
      phone: [
        Validators.required,
        Validators.pattern(this.VALIDATION.PHONE_PATTERN),
      ],
      domain: [
        Validators.required,
        Validators.pattern(this.VALIDATION.DOMAIN_PATTERN),
      ],
      packageType: [Validators.required],
      packagePrice: [
        Validators.required,
        Validators.min(this.VALIDATION.MIN_PRICE),
        Validators.pattern(this.VALIDATION.PRICE_PATTERN),
      ],
      renewalDate: [Validators.required],
    };
  }

  /**
   * Get validation error message
   */
  getErrorMessage(control: AbstractControl, fieldName: string): string {
    if (!control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors as ValidationErrors;

    if (errors['required']) {
      return `${fieldName} הוא שדה חובה`;
    }

    if (errors['minlength']) {
      return `${fieldName} חייב להכיל לפחות ${errors['minlength'].requiredLength} תווים`;
    }

    if (errors['maxlength']) {
      return `${fieldName} חייב להכיל לכל היותר ${errors['maxlength'].requiredLength} תווים`;
    }

    if (errors['email']) {
      return 'כתובת אימייל לא תקינה';
    }

    if (errors['pattern']) {
      return this.getPatternErrorMessage(
        fieldName,
        errors['pattern'].requiredPattern
      );
    }

    if (errors['min']) {
      return `${fieldName} חייב להיות לפחות ${errors['min'].min}`;
    }

    return 'ערך לא תקין';
  }

  /**
   * Get pattern-specific error messages
   */
  private getPatternErrorMessage(fieldName: string, pattern: string): string {
    const patterns = {
      [this.VALIDATION.PHONE_PATTERN.toString()]: 'מספר טלפון לא תקין',
      [this.VALIDATION.DOMAIN_PATTERN.toString()]: 'כתובת דומיין לא תקינה',
      [this.VALIDATION.PRICE_PATTERN.toString()]: 'מחיר לא תקין',
    };

    return patterns[pattern] || 'ערך לא תקין';
  }

  /**
   * Check if field has error
   */
  hasError(control: AbstractControl): boolean {
    return !!(control.errors && control.touched);
  }

  /**
   * Mark all form controls as touched
   */
  markFormGroupTouched(controls: { [key: string]: AbstractControl }): void {
    Object.keys(controls).forEach((key) => {
      const control = controls[key];
      control.markAsTouched();

      if (control.invalid) {
        control.markAsDirty();
      }
    });
  }
}
