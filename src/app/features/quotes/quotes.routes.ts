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
        path: 'public/:token',
        loadComponent: () =>
          import('./components/quote-public-view/quote-public-view.component').then(
            m => m.QuotePublicViewComponent
          ),
      },
      // TODO: Add more routes for create, edit, details
    ],
  },
];
