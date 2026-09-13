import { DomainException } from '../../../../../../common/exceptions/domain.exception';

export interface TurnoProps {
  id: number;
  nombre: string;
  descripcion: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  conductorId: number;
  vehiculoId: number;
}

export interface TurnoCreateProps {
  nombre: string;
  descripcion?: string | null;
  conductorId: number;
  vehiculoId: number;
}

export interface TurnoUpdateProps {
  nombre?: string;
  descripcion?: string | null;
}

export class Turno {
  readonly id: number;
  nombre: string;
  descripcion: string | null;
  isActive: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
  readonly conductorId: number;
  readonly vehiculoId: number;

  constructor(props: TurnoProps) {
    Turno.validateNombre(props.nombre);
    this.id = props.id;
    this.nombre = props.nombre;
    this.descripcion = props.descripcion;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.conductorId = props.conductorId;
    this.vehiculoId = props.vehiculoId;
  }

  static create(props: TurnoCreateProps): TurnoCreateProps {
    Turno.validateNombre(props.nombre);

    return {
      nombre: props.nombre.trim(),
      descripcion: props.descripcion ?? null,
      conductorId: props.conductorId,
      vehiculoId: props.vehiculoId,
    };
  }

  update(props: TurnoUpdateProps): void {
    if (props.nombre !== undefined) {
      Turno.validateNombre(props.nombre);
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
