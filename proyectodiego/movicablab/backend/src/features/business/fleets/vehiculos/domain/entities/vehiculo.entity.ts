import { DomainException } from '../../../../../../common/exceptions/domain.exception';

export interface VehiculoProps {
  id: number;
  nombre: string;
  descripcion: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  empresaId: number;
}

export interface VehiculoCreateProps {
  nombre: string;
  descripcion?: string | null;
  empresaId: number;
}

export interface VehiculoUpdateProps {
  nombre?: string;
  descripcion?: string | null;
}

export class Vehiculo {
  readonly id: number;
  nombre: string;
  descripcion: string | null;
  isActive: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
  readonly empresaId: number;

  constructor(props: VehiculoProps) {
    Vehiculo.validateNombre(props.nombre);
    this.id = props.id;
    this.nombre = props.nombre;
    this.descripcion = props.descripcion;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.empresaId = props.empresaId;
  }

  static create(props: VehiculoCreateProps): VehiculoCreateProps {
    Vehiculo.validateNombre(props.nombre);

    return {
      nombre: props.nombre.trim(),
      descripcion: props.descripcion ?? null,
      empresaId: props.empresaId,
    };
  }

  update(props: VehiculoUpdateProps): void {
    if (props.nombre !== undefined) {
      Vehiculo.validateNombre(props.nombre);
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
