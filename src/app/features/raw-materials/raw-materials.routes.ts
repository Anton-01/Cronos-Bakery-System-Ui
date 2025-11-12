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
      {
        path: 'create',
        loadComponent: () =>
          import('./components/raw-material-form/raw-material-form.component').then(
            m => m.RawMaterialFormComponent
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./components/raw-material-form/raw-material-form.component').then(
            m => m.RawMaterialFormComponent
          ),
      },
    ],
  },
];
