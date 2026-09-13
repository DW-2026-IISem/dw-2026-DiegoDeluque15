import { DomainException } from '../../../../../../common/exceptions/domain.exception';

export interface ConductorProps {
  id: number;
  nombre: string;
  descripcion: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  empresaId: number | null;
}

export interface ConductorCreateProps {
  nombre: string;
  descripcion?: string | null;
  empresaId?: number | null;
}

export interface ConductorUpdateProps {
  nombre?: string;
  descripcion?: string | null;
  empresaId?: number | null;
}

export class Conductor {
  readonly id: number;
  nombre: string;
  descripcion: string | null;
  isActive: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
  empresaId: number | null;

  constructor(props: ConductorProps) {
    Conductor.validateNombre(props.nombre);
    this.id = props.id;
    this.nombre = props.nombre;
    this.descripcion = props.descripcion;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.empresaId = props.empresaId;
  }

  static create(props: ConductorCreateProps): ConductorCreateProps {
    Conductor.validateNombre(props.nombre);

    return {
      nombre: props.nombre.trim(),
      descripcion: props.descripcion ?? null,
      empresaId: props.empresaId ?? null,
    };
  }

  update(props: ConductorUpdateProps): void {
    if (props.nombre !== undefined) {
      Conductor.validateNombre(props.nombre);
      this.nombre = props.nombre.trim();
    }

    if (props.descripcion !== undefined) {
      this.descripcion = props.descripcion;
    }

    if (props.empresaId !== undefined) {
      this.empresaId = props.empresaId;
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
