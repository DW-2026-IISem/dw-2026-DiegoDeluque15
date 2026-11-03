import { Money, Timestamps } from './api.model';

/** Valores de dato definidos por el backend: se envían y comparan tal cual. */
export type TripStatus = 'solicitada' | 'aceptada' | 'en_curso' | 'cerrada' | 'cancelada';

/** Espejo de TRANSITIONS del backend; una transición inválida responde 409. */
export const TRIP_TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  solicitada: ['aceptada', 'cancelada'],
  aceptada: ['en_curso', 'cancelada'],
  en_curso: ['cerrada', 'cancelada'],
  cerrada: [],
  cancelada: [],
};

export const TRIP_STATUS_LABEL: Record<TripStatus, string> = {
  solicitada: 'Solicitada',
  aceptada: 'Aceptada',
  en_curso: 'En curso',
  cerrada: 'Cerrada',
  cancelada: 'Cancelada',
};

/** Tabla `trips` — /api/carreras */
export interface Trip extends Timestamps {
  id: number;
  passenger_id: number;
  shift_id: number;
  fare_id: number;
  started_at: string;
  ended_at: string | null;
  total: Money | null;
  status: TripStatus;
  notes: string | null;
  settlement_id: number | null;
  passenger?: { id: number; name: string | null } | null;
  shift?: { id: number; name: string } | null;
  fare?: { id: number; name: string; base_value: Money } | null;
}

/** Siempre nace `solicitada`; el total lo fija el backend al cerrar (= fare.base_value). */
export interface TripCreatePayload {
  passenger_id: number;
  shift_id: number;
  fare_id: number;
  notes?: string | null;
}

/** PATCH /:id solo modifica notes. */
export interface TripUpdatePayload {
  notes: string | null;
}

/** PATCH /:id/estado: única puerta para cambiar el estado. */
export interface TripStatusPayload {
  status: TripStatus;
}
