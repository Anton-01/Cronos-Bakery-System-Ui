import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      // TODO: Implement raw materials routes
      // {
      //   path: '',
      //   loadComponent: () =>
      //     import('./components/material-list/material-list.component').then(
      //       (m) => m.MaterialListComponent
      //     ),
      // },
    ],
  },
];
