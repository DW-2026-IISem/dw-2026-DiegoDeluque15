import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Trip, TripCreatePayload, TripStatus, TripUpdatePayload } from '../../core/models/trip.model';

@Injectable({ providedIn: 'root' })
export class TripApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/carreras`;

  list(): Observable<Trip[]> {
    return this.http.get<{ trips: Trip[] }>(this.base).pipe(map((r) => r.trips));
  }

  get(id: number): Observable<Trip> {
    return this.http.get<{ trip: Trip }>(`${this.base}/${id}`).pipe(map((r) => r.trip));
  }

  create(payload: TripCreatePayload): Observable<Trip> {
    return this.http.post<{ trip: Trip }>(this.base, payload).pipe(map((r) => r.trip));
  }

  update(id: number, payload: TripUpdatePayload): Observable<Trip> {
    return this.http.patch<{ trip: Trip }>(`${this.base}/${id}`, payload).pipe(map((r) => r.trip));
  }

  changeStatus(id: number, status: TripStatus): Observable<Trip> {
    return this.http.patch<{ trip: Trip }>(`${this.base}/${id}/estado`, { status }).pipe(map((r) => r.trip));
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
