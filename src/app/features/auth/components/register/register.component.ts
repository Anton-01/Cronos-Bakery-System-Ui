import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { CreateUserRequest } from '../../../../shared/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  registerForm!: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group(
      {
        username: [
          '',
          [Validators.required, Validators.minLength(3), CustomValidators.validUsername()],
        ],
        email: ['', [Validators.required, Validators.email, CustomValidators.validEmail()]],
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        phoneNumber: ['', [CustomValidators.validPhone()]],
        password: ['', [Validators.required, CustomValidators.strongPassword()]],
        confirmPassword: ['', [Validators.required]],
        acceptTerms: [false, [Validators.requiredTrue]],
      },
      {
        validators: CustomValidators.mustMatch('password', 'confirmPassword'),
      }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const registerRequest: CreateUserRequest = {
      username: this.f['username'].value,
      email: this.f['email'].value,
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      phoneNumber: this.f['phoneNumber'].value || undefined,
      password: this.f['password'].value,
      roles: ['ROLE_USER'], // Default role
    };

    this.authService.register(registerRequest).subscribe({
      next: () => {
        this.notificationService.success(
          'Registro exitoso. Por favor inicia sesión.',
          'Registro Completado'
        );
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error.error?.message || 'Error al registrar usuario.';
        this.notificationService.error(errorMessage, 'Error de Registro');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  getPasswordStrengthErrors(): string[] {
    const errors: string[] = [];
    const passwordControl = this.f['password'];

    if (passwordControl.hasError('weakPassword')) {
      const weakPasswordError = passwordControl.errors?.['weakPassword'];
      if (!weakPasswordError.hasUpperCase) errors.push('una mayúscula');
      if (!weakPasswordError.hasLowerCase) errors.push('una minúscula');
      if (!weakPasswordError.hasNumeric) errors.push('un número');
      if (!weakPasswordError.hasSpecial) errors.push('un carácter especial');
      if (!weakPasswordError.isLengthValid) errors.push('mínimo 8 caracteres');
    }

    return errors;
  }
}
