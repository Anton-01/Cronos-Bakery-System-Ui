import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/quotes-list/quotes-list.component').then(
            m => m.QuotesListComponent
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./components/quote-form/quote-form.component').then(
            m => m.QuoteFormComponent
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./components/quote-form/quote-form.component').then(
            m => m.QuoteFormComponent
          ),
      },
      {
        path: 'public/:token',
        loadComponent: () =>
          import('./components/quote-public-view/quote-public-view.component').then(
            m => m.QuotePublicViewComponent
          ),
      },
    ],
  },
];
