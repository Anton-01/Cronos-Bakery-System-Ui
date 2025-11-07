import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/raw-materials-list/raw-materials-list.component').then(
            m => m.RawMaterialsListComponent
          ),
      },
      // TODO: Add more routes for create, edit, details
    ],
  },
];
