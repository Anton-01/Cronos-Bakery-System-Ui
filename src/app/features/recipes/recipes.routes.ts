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
      {
        path: 'create',
        loadComponent: () =>
          import('./components/recipe-form/recipe-form.component').then(
            m => m.RecipeFormComponent
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./components/recipe-form/recipe-form.component').then(
            m => m.RecipeFormComponent
          ),
      },
    ],
  },
];
