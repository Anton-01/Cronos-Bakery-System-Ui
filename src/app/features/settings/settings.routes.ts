import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/user-profile/user-profile.component').then(
            m => m.UserProfileComponent
          ),
      },
      // TODO: Add more routes for other settings
    ],
  },
];
