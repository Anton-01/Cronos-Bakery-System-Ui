import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/recipes-list/recipes-list.component').then(
            m => m.RecipesListComponent
          ),
      },
      // TODO: Add more routes for create, edit, details
    ],
  },
];
