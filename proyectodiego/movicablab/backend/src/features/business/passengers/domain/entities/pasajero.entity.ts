import { DomainException } from '../../../../../common/exceptions/domain.exception';

export interface PasajeroProps {
  id: number;
  nombre: string;
  descripcion: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PasajeroCreateProps {
  nombre: string;
  descripcion?: string | null;
}

export interface PasajeroUpdateProps {
  nombre?: string;
  descripcion?: string | null;
}

export class Pasajero {
  readonly id: number;
  nombre: string;
  descripcion: string | null;
  isActive: boolean;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: PasajeroProps) {
    Pasajero.validateNombre(props.nombre);
    this.id = props.id;
    this.nombre = props.nombre;
    this.descripcion = props.descripcion;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: PasajeroCreateProps): PasajeroCreateProps {
    Pasajero.validateNombre(props.nombre);
    return {
      nombre: props.nombre.trim(),
      descripcion: props.descripcion ?? null,
    };
  }

  update(props: PasajeroUpdateProps): void {
    if (props.nombre !== undefined) {
      Pasajero.validateNombre(props.nombre);
      this.nombre = props.nombre.trim();
    }

    if (props.descripcion !== undefined) {
      this.descripcion = props.descripcion;
    }

    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  private static validateNombre(nombre: string): void {
    if (!nombre || nombre.trim().length < 2) {
      throw new DomainException('El nombre debe tener al menos 2 caracteres');
    }
  }
}
