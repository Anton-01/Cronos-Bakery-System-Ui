import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-reauth-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './reauth-dialog.component.html',
  styleUrl: './reauth-dialog.component.scss',
})
export class ReauthDialogComponent implements OnInit {
  reauthForm!: FormGroup;
  loading = false;
  hidePassword = true;
  username = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<ReauthDialogComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
    const currentUser = this.authService.currentUserValue;
    this.username = currentUser?.username || '';
  }

  private initForm(): void {
    this.reauthForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.reauthForm.controls;
  }

  onSubmit(): void {
    if (this.reauthForm.invalid) {
      this.reauthForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const password = this.f['password'].value;

    this.authService.reAuthenticate(password).subscribe({
      next: () => {
        this.notificationService.success('Sesión renovada exitosamente');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error.error?.message || 'Contraseña incorrecta';
        this.notificationService.error(errorMessage);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
