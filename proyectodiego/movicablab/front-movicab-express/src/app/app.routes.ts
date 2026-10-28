import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'construir',
    loadComponent: () => import('./features/construir/construir').then((m) => m.Construir),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [{ path: '', pathMatch: 'full', redirectTo: '/construir' }],
  },
  { path: '**', redirectTo: 'construir' },
];