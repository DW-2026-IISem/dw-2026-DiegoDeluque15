import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SharedModule } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SettlementApi } from './settlement-api';
import { DriverApi } from '../drivers/driver-api';
import { TripApi } from '../trips/trip-api';
import { ShiftApi } from '../shifts/shift-api';
import { NotificationService } from '../../core/services/notification';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { Settlement } from '../../core/models/settlement.model';
import { Driver } from '../../core/models/driver.model';
import { Trip } from '../../core/models/trip.model';
import { Shift } from '../../core/models/shift.model';

export interface DriverSettlementSummary {
  driver: Driver;
  habilitado: boolean;
  pendingTripsCount: number;
  pendingAmount: number;
  dateFrom: string | null;
  dateTo: string | null;
  reason: string;
}

@Component({
  selector: 'app-settlement-list',
  imports: [
    ButtonModule,
    TableModule,
    TagModule,
    PageHeader,
    EmptyState,
    RouterLink,
    SharedModule,
    DecimalPipe,
    DatePipe,
  ],
  templateUrl: './settlement-list.html',
})
export class SettlementList implements OnInit {
  private readonly api = inject(SettlementApi);
  private readonly driverApi = inject(DriverApi);
  private readonly tripApi = inject(TripApi);
  private readonly shiftApi = inject(ShiftApi);
  private readonly notify = inject(NotificationService);

  settlements = signal<Settlement[]>([]);
  drivers = signal<Driver[]>([]);
  driverStatuses = signal<DriverSettlementSummary[]>([]);
  filter = signal<'all' | 'habilitados' | 'no-habilitados'>('all');
  loading = signal(true);

  filteredDrivers = computed(() => {
    const list = this.driverStatuses();
    const currentFilter = this.filter();
    if (currentFilter === 'habilitados') {
      return list.filter((item) => item.habilitado);
    }
    if (currentFilter === 'no-habilitados') {
      return list.filter((item) => !item.habilitado);
    }
    return list;
  });

  habilitadosCount = computed(
    () => this.driverStatuses().filter((item) => item.habilitado).length
  );

  noHabilitadosCount = computed(
    () => this.driverStatuses().filter((item) => !item.habilitado).length
  );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);

    forkJoin({
      settlements: this.api.list().pipe(catchError(() => of([] as Settlement[]))),
      drivers: this.driverApi.list().pipe(catchError(() => of([] as Driver[]))),
      trips: this.tripApi.list().pipe(catchError(() => of([] as Trip[]))),
      shifts: this.shiftApi.list().pipe(catchError(() => of([] as Shift[]))),
    }).subscribe({
      next: ({ settlements, drivers, trips, shifts }) => {
        this.settlements.set(settlements ?? []);
        this.drivers.set(drivers ?? []);

        // Mapeo rápido de turnos por ID hacia el conductor correspondiente
        const shiftDriverMap = new Map<number, number>();
        (shifts ?? []).forEach((s) => shiftDriverMap.set(s.id, s.driver_id));

        // Filtrar carreras cerradas que aún no han sido liquidadas
        const pendingTrips = (trips ?? []).filter(
          (t) => t.status === 'cerrada' && !t.settlement_id
        );

        // Agrupar viajes pendientes por conductor
        const tripsByDriver = new Map<number, Trip[]>();
        pendingTrips.forEach((t) => {
          const driverId = shiftDriverMap.get(t.shift_id);
          if (driverId) {
            const list = tripsByDriver.get(driverId) ?? [];
            list.push(t);
            tripsByDriver.set(driverId, list);
          }
        });

        // Construir estado de liquidación de cada conductor
        const summaries: DriverSettlementSummary[] = (drivers ?? []).map((driver) => {
          const dTrips = tripsByDriver.get(driver.id) ?? [];
          const isDriverActive = driver.status === 'active';
          const hasPending = dTrips.length > 0;
          const habilitado = isDriverActive && hasPending;

          let dateFrom: string | null = null;
          let dateTo: string | null = null;
          let pendingAmount = 0;

          if (hasPending) {
            pendingAmount = dTrips.reduce((acc, t) => acc + Number(t.total ?? 0), 0);

            const dates = dTrips
              .map((t) => t.ended_at || t.started_at)
              .filter(Boolean)
              .sort();
            if (dates.length > 0) {
              dateFrom = dates[0];
              dateTo = dates[dates.length - 1];
            }
          }

          let reason = '';
          if (!isDriverActive) {
            reason = 'Conductor inactivo';
          } else if (hasPending) {
            reason = `${dTrips.length} carrera(s) pendiente(s)`;
          } else {
            reason = 'Sin carreras cerradas pendientes';
          }

          return {
            driver,
            habilitado,
            pendingTripsCount: dTrips.length,
            pendingAmount,
            dateFrom,
            dateTo,
            reason,
          };
        });

        // Ordenar: primero los habilitados, luego no habilitados, por monto desc y nombre
        summaries.sort((a, b) => {
          if (a.habilitado !== b.habilitado) {
            return a.habilitado ? -1 : 1;
          }
          if (b.pendingAmount !== a.pendingAmount) {
            return b.pendingAmount - a.pendingAmount;
          }
          return a.driver.name.localeCompare(b.driver.name);
        });

        this.driverStatuses.set(summaries);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error al cargar datos de liquidaciones');
        this.loading.set(false);
      },
    });
  }

  getDriverName(driverId: number): string {
    const driver = this.drivers().find((d) => d.id === driverId);
    return driver?.name ?? `Conductor #${driverId}`;
  }
}
