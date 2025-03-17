import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'customers',
    loadChildren: () => import('./features/customers/customers.routes')
  },
  {
    path: '**',
    redirectTo: 'customers',
    pathMatch: 'full'
  }
];
