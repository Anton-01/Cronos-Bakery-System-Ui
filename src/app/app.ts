import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ThemeService } from './core/services/theme.service';
import { LanguageService } from './core/services/language.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App implements OnInit {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private authService = inject(AuthService);

  title = 'Cronos Bakery System';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor() {}

  ngOnInit(): void {
    // Initialize theme listener for auto mode
    this.themeService.initializeAutoThemeListener();

    // Initialize i18n
    this.languageService.init();

    // Restore session on app initialization
    this.authService.restoreSession().subscribe({
      next: (restored) => {
        if (restored) {
          console.log('Session restored successfully');
        }
      },
      error: (error) => {
        console.error('Error restoring session:', error);
      }
    });
  }
}
