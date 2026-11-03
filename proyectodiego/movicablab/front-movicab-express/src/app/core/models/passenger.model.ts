import { Status, Timestamps } from './api.model';

/** Tabla `passengers` — /api/pasajeros. El backend devuelve el hash de password: la UI no lo modela. */
export interface Passenger extends Timestamps {
  id: number;
  name: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  status: Status;
}

export interface PassengerPayload {
  name: string;
  address?: string | null;
  phone: string;
  email: string;
  password?: string;
  status?: Status;
}
