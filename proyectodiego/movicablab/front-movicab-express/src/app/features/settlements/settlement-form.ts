import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SettlementApi } from './settlement-api';
import { DriverApi } from '../drivers/driver-api';
import { TripApi } from '../trips/trip-api';
import { ShiftApi } from '../shifts/shift-api';
import { NotificationService } from '../../core/services/notification';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { Driver } from '../../core/models/driver.model';
import { SettlementPayload } from '../../core/models/settlement.model';
import { Trip } from '../../core/models/trip.model';
import { Shift } from '../../core/models/shift.model';

export interface DriverSettlementOption {
  id: number;
  name: string;
  companyName: string;
  habilitado: boolean;
  pendingTripsCount: number;
  pendingAmount: number;
  dateFrom: string | null;
  dateTo: string | null;
  reason: string;
}

@Component({
  selector: 'app-settlement-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    TextareaModule,
    TagModule,
    PageHeader,
    DecimalPipe,
  ],
  templateUrl: './settlement-form.html',
})
export class SettlementForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(SettlementApi);
  private readonly driverApi = inject(DriverApi);
  private readonly tripApi = inject(TripApi);
  private readonly shiftApi = inject(ShiftApi);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notify = inject(NotificationService);

  loading = signal(false);
  initialLoading = signal(true);
  driverOptions = signal<DriverSettlementOption[]>([]);
  selectedDriverId = signal<number | null>(null);

  selectedDriver = computed(() => {
    const id = this.selectedDriverId();
    if (!id) return null;
    return this.driverOptions().find((d) => d.id === id) ?? null;
  });

  form = this.fb.group({
    driver_id: [null as number | null, Validators.required],
    date_from: [null as Date | null, Validators.required],
    date_to: [null as Date | null, Validators.required],
    notes: [''],
  });

  ngOnInit(): void {
    this.form.get('driver_id')?.valueChanges.subscribe((val) => {
      this.selectedDriverId.set(val);
      if (val) {
        const option = this.driverOptions().find((d) => d.id === val);
        if (option && option.dateFrom && option.dateTo && !this.form.get('date_from')?.value) {
          this.form.patchValue({
            date_from: new Date(option.dateFrom),
            date_to: new Date(option.dateTo),
          });
        }
      }
    });

    this.loadData();
  }

  private loadData(): void {
    this.initialLoading.set(true);

    forkJoin({
      drivers: this.driverApi.list().pipe(catchError(() => of([] as Driver[]))),
      trips: this.tripApi.list().pipe(catchError(() => of([] as Trip[]))),
      shifts: this.shiftApi.list().pipe(catchError(() => of([] as Shift[]))),
    }).subscribe({
      next: ({ drivers, trips, shifts }) => {
        const shiftDriverMap = new Map<number, number>();
        (shifts ?? []).forEach((s) => shiftDriverMap.set(s.id, s.driver_id));

        const pendingTrips = (trips ?? []).filter(
          (t) => t.status === 'cerrada' && !t.settlement_id
        );

        const tripsByDriver = new Map<number, Trip[]>();
        pendingTrips.forEach((t) => {
          const driverId = shiftDriverMap.get(t.shift_id);
          if (driverId) {
            const list = tripsByDriver.get(driverId) ?? [];
            list.push(t);
            tripsByDriver.set(driverId, list);
          }
        });

        const options: DriverSettlementOption[] = (drivers ?? []).map((driver) => {
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
            id: driver.id,
            name: driver.name,
            companyName: driver.company?.legal_name || 'Conductor independiente',
            habilitado,
            pendingTripsCount: dTrips.length,
            pendingAmount,
            dateFrom,
            dateTo,
            reason,
          };
        });

        // Ordenar con prioridad: PRIMERO habilitados, luego no habilitados
        options.sort((a, b) => {
          if (a.habilitado !== b.habilitado) {
            return a.habilitado ? -1 : 1;
          }
          if (b.pendingAmount !== a.pendingAmount) {
            return b.pendingAmount - a.pendingAmount;
          }
          return a.name.localeCompare(b.name);
        });

        this.driverOptions.set(options);
        this.initialLoading.set(false);

        // Atender query params si vienen de la tabla principal
        const qp = this.route.snapshot.queryParams;
        if (qp['driver_id']) {
          const driverIdNum = Number(qp['driver_id']);
          this.form.patchValue({ driver_id: driverIdNum });
          this.selectedDriverId.set(driverIdNum);

          if (qp['date_from']) {
            this.form.patchValue({ date_from: new Date(qp['date_from']) });
          }
          if (qp['date_to']) {
            this.form.patchValue({ date_to: new Date(qp['date_to']) });
          }
        }
      },
      error: () => {
        this.notify.error('Error al cargar datos para liquidar');
        this.initialLoading.set(false);
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const raw = this.form.getRawValue();

    const fromDate = raw.date_from instanceof Date ? raw.date_from : new Date(raw.date_from!);
    const toDate = raw.date_to instanceof Date ? raw.date_to : new Date(raw.date_to!);

    const pad = (n: number) => String(n).padStart(2, '0');
    const fromStr = `${fromDate.getFullYear()}-${pad(fromDate.getMonth() + 1)}-${pad(fromDate.getDate())}T00:00:00.000Z`;
    const toStr = `${toDate.getFullYear()}-${pad(toDate.getMonth() + 1)}-${pad(toDate.getDate())}T23:59:59.999Z`;

    const payload: SettlementPayload = {
      driver_id: raw.driver_id!,
      date_from: fromStr,
      date_to: toStr,
      notes: raw.notes || null,
    };

    this.api.create(payload).subscribe({
      next: () => {
        this.notify.success('Liquidación generada con éxito');
        this.router.navigate(['/settlements']);
      },
      error: (err) => {
        const rawMsg = err?.error?.error ?? err?.error?.detail ?? '';
        const detail = this.translateError(rawMsg);
        this.notify.error('Error al generar liquidación', detail);
        this.loading.set(false);
      },
    });
  }

  private translateError(rawMsg: string): string {
    if (!rawMsg) return 'No se pudo generar la liquidación. Verifica los datos e intenta de nuevo.';
    const lower = rawMsg.toLowerCase();
    if (lower.includes('nothing to settle') || lower.includes('no hay carreras')) {
      return 'No hay carreras cerradas pendientes para liquidar en ese rango de fechas para este conductor.';
    }
    if (lower.includes('not found') || lower.includes('no encontrado')) {
      return 'El conductor seleccionado no fue encontrado en el sistema.';
    }
    if (lower.includes('required') || lower.includes('obligatorio')) {
      return 'El conductor y el rango de fechas son campos obligatorios.';
    }
    if (lower.includes('transaction failed') || lower.includes('error en la transacción')) {
      return 'Ocurrió un error en el servidor al procesar la liquidación.';
    }
    return rawMsg;
  }

  cancel(): void {
    this.router.navigate(['/settlements']);
  }
}
