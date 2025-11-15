import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/reports-dashboard/reports-dashboard.component').then(
            (m) => m.ReportsDashboardComponent
          ),
      },
    ],
  },
];
