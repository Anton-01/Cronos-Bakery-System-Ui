import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validators for form validation
 */
export class CustomValidators {
  /**
   * Validator for password strength
   * Password must contain:
   * - At least 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   */
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isLengthValid = value.length >= 8;

      const passwordValid =
        hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && isLengthValid;

      if (!passwordValid) {
        return {
          weakPassword: {
            hasUpperCase,
            hasLowerCase,
            hasNumeric,
            hasSpecial,
            isLengthValid,
          },
        };
      }

      return null;
    };
  }

  /**
   * Validator to check if password and confirm password match
   */
  static mustMatch(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);

      if (!password || !confirmPassword) {
        return null;
      }

      if (confirmPassword.errors && !confirmPassword.errors['mustMatch']) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        confirmPassword.setErrors(null);
        return null;
      }
    };
  }

  /**
   * Validator to check if value contains no script tags
   */
  static noScriptTags(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value)) {
        return { scriptTag: true };
      }

      return null;
    };
  }

  /**
   * Validator for username
   * Username must:
   * - Be between 3 and 20 characters
   * - Contain only alphanumeric characters and underscores
   * - Start with a letter
   */
  static validUsername(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const usernamePattern = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
      if (!usernamePattern.test(value)) {
        return { invalidUsername: true };
      }

      return null;
    };
  }

  /**
   * Validator for email format
   */
  static validEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(value)) {
        return { invalidEmail: true };
      }

      return null;
    };
  }

  /**
   * Validator for phone number (international format)
   */
  static validPhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const phonePattern = /^\+?[1-9]\d{1,14}$/;
      if (!phonePattern.test(value)) {
        return { invalidPhone: true };
      }

      return null;
    };
  }

  /**
   * Validator for 2FA code (6 digits)
   */
  static validTwoFactorCode(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const codePattern = /^\d{6}$/;
      if (!codePattern.test(value)) {
        return { invalidTwoFactorCode: true };
      }

      return null;
    };
  }

  /**
   * Validator for minimum value
   */
  static min(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null;
      }

      const numValue = Number(value);
      if (isNaN(numValue) || numValue < min) {
        return { min: { min, actual: value } };
      }

      return null;
    };
  }

  /**
   * Validator for maximum value
   */
  static max(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null;
      }

      const numValue = Number(value);
      if (isNaN(numValue) || numValue > max) {
        return { max: { max, actual: value } };
      }

      return null;
    };
  }

  /**
   * Validator for whitespace
   */
  static noWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const isWhitespace = (value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
}
