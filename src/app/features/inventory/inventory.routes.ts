import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/inventory-list/inventory-list.component').then(
            (m) => m.InventoryListComponent
          ),
      },
    ],
  },
];
