import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'es' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly STORAGE_KEY = 'app-language';
  private currentLanguageSubject: BehaviorSubject<Language>;
  public currentLanguage$: Observable<Language>;

  constructor() {
    const savedLanguage = this.getSavedLanguage();
    this.currentLanguageSubject = new BehaviorSubject<Language>(savedLanguage);
    this.currentLanguage$ = this.currentLanguageSubject.asObservable();
  }

  /**
   * Initialize translation service
   */
  async init(): Promise<void> {
    const savedLanguage = this.getSavedLanguage();

    // Set available languages
    this.translate.addLangs(['es', 'en']);

    // Set default language
    this.translate.setDefaultLang('es');

    // Load translations manually
    await this.loadTranslations();

    // Set current language
    this.translate.use(savedLanguage);
  }

  /**
   * Load translations from JSON files
   */
  private async loadTranslations(): Promise<void> {
    try {
      const [esTranslations, enTranslations] = await Promise.all([
        fetch('/i18n/es.json').then(res => res.json()),
        fetch('/i18n/en.json').then(res => res.json()),
      ]);

      this.translate.setTranslation('es', esTranslations);
      this.translate.setTranslation('en', enTranslations);
    } catch (error) {
      console.error('Error loading translations:', error);
      // Set empty translations as fallback
      this.translate.setTranslation('es', {});
      this.translate.setTranslation('en', {});
    }
  }

  /**
   * Change current language
   */
  setLanguage(lang: Language): void {
    this.translate.use(lang);
    this.saveLanguage(lang);
    this.currentLanguageSubject.next(lang);
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  /**
   * Get saved language from storage or browser
   */
  private getSavedLanguage(): Language {
    const saved = sessionStorage.getItem(this.STORAGE_KEY);
    if (saved && (saved === 'es' || saved === 'en')) {
      return saved as Language;
    }

    // Try to get from browser
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'es';
  }

  /**
   * Save language to storage
   */
  private saveLanguage(lang: Language): void {
    sessionStorage.setItem(this.STORAGE_KEY, lang);
  }

  /**
   * Get translation for a key
   */
  translate$(key: string | string[], params?: any): Observable<string | any> {
    return this.translate.stream(key, params);
  }

  /**
   * Get instant translation for a key
   */
  instant(key: string | string[], params?: any): string | any {
    return this.translate.instant(key, params);
  }
}
