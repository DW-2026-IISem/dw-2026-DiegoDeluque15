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
      {
        path: 'vehicle-types',
        loadComponent: () =>
          import('./features/vehicle-types/vehicle-type-list').then((m) => m.VehicleTypeList),
      },
      {
        path: 'vehicle-types/new',
        loadComponent: () =>
          import('./features/vehicle-types/vehicle-type-form').then((m) => m.VehicleTypeForm),
      },
      {
        path: 'vehicle-types/:id/edit',
        loadComponent: () =>
          import('./features/vehicle-types/vehicle-type-form').then((m) => m.VehicleTypeForm),
      },
      // ISS-05 — Conductores
      {
        path: 'drivers',
        loadComponent: () =>
          import('./features/drivers/driver-list').then((m) => m.DriverList),
      },
      {
        path: 'drivers/new',
        loadComponent: () =>
          import('./features/drivers/driver-form').then((m) => m.DriverForm),
      },
      {
        path: 'drivers/:id/edit',
        loadComponent: () =>
          import('./features/drivers/driver-form').then((m) => m.DriverForm),
      },
      // ISS-05 — Turnos
      {
        path: 'shifts',
        loadComponent: () =>
          import('./features/shifts/shift-list').then((m) => m.ShiftList),
      },
      {
        path: 'shifts/new',
        loadComponent: () =>
          import('./features/shifts/shift-form').then((m) => m.ShiftForm),
      },
      {
        path: 'shifts/:id/edit',
        loadComponent: () =>
          import('./features/shifts/shift-form').then((m) => m.ShiftForm),
      },
      // ISS-05 — Tarifas
      {
        path: 'fares',
        loadComponent: () =>
          import('./features/fares/fare-list').then((m) => m.FareList),
      },
      {
        path: 'fares/new',
        loadComponent: () =>
          import('./features/fares/fare-form').then((m) => m.FareForm),
      },
      {
        path: 'fares/:id/edit',
        loadComponent: () =>
          import('./features/fares/fare-form').then((m) => m.FareForm),
      },
    ],

  },
  { path: '**', redirectTo: '' },
];
