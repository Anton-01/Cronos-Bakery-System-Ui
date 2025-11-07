import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  // Redirect root to dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },

  // Auth routes (guest only)
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/components/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/components/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        path: 'two-factor',
        loadComponent: () =>
          import('./features/auth/components/two-factor-auth/two-factor-auth.component').then(
            (m) => m.TwoFactorAuthComponent
          ),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/components/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },

  // Protected routes (requires authentication)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/dashboard/components/dashboard-home/dashboard-home.component'
          ).then((m) => m.DashboardHomeComponent),
      },
      {
        path: 'raw-materials',
        loadChildren: () =>
          import('./features/raw-materials/raw-materials.routes').then((m) => m.routes),
      },
      {
        path: 'recipes',
        loadChildren: () => import('./features/recipes/recipes.routes').then((m) => m.routes),
      },
      {
        path: 'quotes',
        loadChildren: () => import('./features/quotes/quotes.routes').then((m) => m.routes),
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('./features/inventory/inventory.routes').then((m) => m.routes),
      },
      {
        path: 'reports',
        loadChildren: () => import('./features/reports/reports.routes').then((m) => m.routes),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.routes').then((m) => m.routes),
      },
    ],
  },

  // Error pages
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/components/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },

  // 404 - Must be last
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
