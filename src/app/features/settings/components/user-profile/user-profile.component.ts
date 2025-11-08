import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { ProfileService } from '../../../../core/services/profile.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserProfile } from '../../../../shared/models/profile.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
  ],
  template: `
    <div class="profile-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <h1>Perfil de Usuario</h1>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="Información Personal">
              @if (loading) {
                <p>Cargando perfil...</p>
              } @else if (profile) {
                <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="profile-form">
                  <mat-form-field appearance="outline">
                    <mat-label>Nombre</mat-label>
                    <input matInput formControlName="firstName" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Apellido</mat-label>
                    <input matInput formControlName="lastName" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="email" type="email" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Teléfono</mat-label>
                    <input matInput formControlName="phone" />
                  </mat-form-field>

                  <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || saving">
                    <mat-icon>save</mat-icon>
                    Guardar Cambios
                  </button>
                </form>
              }
            </mat-tab>

            <mat-tab label="Seguridad">
              <div class="security-section">
                <h3>Cambiar Contraseña</h3>
                <!-- TODO: Implementar formulario de cambio de contraseña -->
                <h3>Autenticación de Dos Factores</h3>
                <button mat-raised-button color="primary">
                  <mat-icon>security</mat-icon>
                  Configurar 2FA
                </button>
              </div>
            </mat-tab>

            <mat-tab label="Configuración">
              <div class="config-section">
                <h3>Configuración de Branding</h3>
                <!-- TODO: Implementar configuración de branding -->
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 24px 0;
    }
    .security-section,
    .config-section {
      padding: 24px 0;
    }
  `],
})
export class UserProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly notificationService = inject(NotificationService);

  profile: UserProfile | null = null;
  loading = false;
  saving = false;

  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: profile => {
        this.profile = profile;
        this.profileForm.patchValue({
          firstName: profile.personalData.firstName,
          lastName: profile.personalData.lastName,
          email: profile.email,
          phone: profile.personalData.phoneNumber || '',
        });
        this.loading = false;
      },
      error: error => {
        this.notificationService.showError('Error al cargar perfil');
        console.error(error);
        this.loading = false;
      },
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.saving = true;
      const updateData = this.profileForm.value;
      this.profileService.updateProfile(updateData as any).subscribe({
        next: () => {
          this.notificationService.showSuccess('Perfil actualizado correctamente');
          this.saving = false;
        },
        error: error => {
          this.notificationService.showError('Error al actualizar perfil');
          console.error(error);
          this.saving = false;
        },
      });
    }
  }
}
