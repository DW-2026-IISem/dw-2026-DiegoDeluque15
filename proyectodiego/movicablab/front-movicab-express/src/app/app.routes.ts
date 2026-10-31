import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'passengers' },
      {
        path: 'construir',
        loadComponent: () =>
          import('./features/construir/construir').then((m) => m.Construir),
      },
      {
        path: 'passengers',
        loadComponent: () =>
          import('./features/passengers/passenger-list').then((m) => m.PassengerList),
      },
      {
        path: 'passengers/new',
        loadComponent: () =>
          import('./features/passengers/passenger-form').then((m) => m.PassengerForm),
      },
      {
        path: 'passengers/:id/edit',
        loadComponent: () =>
          import('./features/passengers/passenger-form').then((m) => m.PassengerForm),
      },
      {
        path: 'vehicles',
        loadComponent: () =>
          import('./features/vehicles/vehicle-list').then((m) => m.VehicleList),
      },
      {
        path: 'vehicles/new',
        loadComponent: () =>
          import('./features/vehicles/vehicle-form').then((m) => m.VehicleForm),
      },
      {
        path: 'vehicles/:id/edit',
        loadComponent: () =>
          import('./features/vehicles/vehicle-form').then((m) => m.VehicleForm),
      },
      {
        path: 'companies',
        loadComponent: () =>
          import('./features/companies/company-list').then((m) => m.CompanyList),
      },
      {
        path: 'companies/new',
        loadComponent: () =>
          import('./features/companies/company-form').then((m) => m.CompanyForm),
      },
      {
        path: 'companies/:id/edit',
        loadComponent: () =>
          import('./features/companies/company-form').then((m) => m.CompanyForm),
      },
    ],

  },
  { path: '**', redirectTo: '' },
];
