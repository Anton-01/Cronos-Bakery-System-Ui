import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QRCodeModule } from 'angularx-qrcode';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { LoginRequest } from '../../../../shared/models';

@Component({
  selector: 'app-two-factor-auth',
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
    MatProgressSpinnerModule,
    QRCodeModule,
  ],
  templateUrl: './two-factor-auth.component.html',
  styleUrl: './two-factor-auth.component.scss',
})
export class TwoFactorAuthComponent implements OnInit {
  twoFactorForm!: FormGroup;
  loading = false;
  username: string = '';
  qrCodeUrl: string = 'otpauth://totp/CronosBakery:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=CronosBakery';
  showQrCode = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    // Get username from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.username = navigation.extras.state['username'] || '';
    }
  }

  ngOnInit(): void {
    this.initForm();

    // If no username, redirect to login
    if (!this.username) {
      this.notificationService.warning('Por favor inicie sesión primero');
      this.router.navigate(['/auth/login']);
    }
  }

  private initForm(): void {
    this.twoFactorForm = this.fb.group({
      code: ['', [Validators.required, CustomValidators.validTwoFactorCode()]],
    });
  }

  get f() {
    return this.twoFactorForm.controls;
  }

  onSubmit(): void {
    if (this.twoFactorForm.invalid) {
      this.twoFactorForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const loginRequest: LoginRequest = {
      username: this.username,
      password: '', // Password already validated in previous step
      twoFactorCode: parseInt(this.f['code'].value, 10),
    };

    this.authService.login(loginRequest).subscribe({
      next: () => {
        this.notificationService.success('Verificación exitosa', 'Bienvenido');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error.error?.message || 'Código 2FA inválido';
        this.notificationService.error(errorMessage, 'Error de Verificación');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  toggleQrCode(): void {
    this.showQrCode = !this.showQrCode;
  }

  onBackToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
