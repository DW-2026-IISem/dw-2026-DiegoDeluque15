import { DomainException } from '../../../../../common/exceptions/domain.exception';

export interface TarifaProps {
  id: number;
  nombre: string;
  reglaCalculo: string;
  valorBase: number;
  vigenciaDesde: Date;
  vigenciaHasta: Date;
  isActive: boolean;
}

export interface TarifaCreateProps {
  nombre: string;
  reglaCalculo: string;
  valorBase: number;
  vigenciaDesde: Date;
  vigenciaHasta: Date;
}

export interface TarifaUpdateProps {
  nombre?: string;
  reglaCalculo?: string;
  valorBase?: number;
  vigenciaDesde?: Date;
  vigenciaHasta?: Date;
}

export class Tarifa {
  readonly id: number;
  nombre: string;
  reglaCalculo: string;
  valorBase: number;
  vigenciaDesde: Date;
  vigenciaHasta: Date;
  isActive: boolean;

  constructor(props: TarifaProps) {
    Tarifa.validateProps(props);
    this.id = props.id;
    this.nombre = props.nombre;
    this.reglaCalculo = props.reglaCalculo;
    this.valorBase = props.valorBase;
    this.vigenciaDesde = props.vigenciaDesde;
    this.vigenciaHasta = props.vigenciaHasta;
    this.isActive = props.isActive;
  }

  static create(props: TarifaCreateProps): TarifaCreateProps {
    Tarifa.validateProps(props);
    return { ...props };
  }

  update(props: TarifaUpdateProps): void {
    if (props.nombre !== undefined) this.nombre = props.nombre;
    if (props.reglaCalculo !== undefined) this.reglaCalculo = props.reglaCalculo;
    if (props.valorBase !== undefined) this.valorBase = props.valorBase;
    if (props.vigenciaDesde !== undefined) this.vigenciaDesde = props.vigenciaDesde;
    if (props.vigenciaHasta !== undefined) this.vigenciaHasta = props.vigenciaHasta;

    Tarifa.validateProps(this);
  }

  deactivate(): void {
    this.isActive = false;
  }

  isCurrentlyActive(): boolean {
    const now = new Date();
    return this.isActive && this.vigenciaDesde <= now && now <= this.vigenciaHasta;
  }

  hasStarted(date: Date = new Date()): boolean {
    return this.vigenciaDesde <= date;
  }

  private static validateProps(props: { valorBase: number; vigenciaDesde: Date; vigenciaHasta: Date }): void {
    if (props.valorBase <= 0) {
      throw new DomainException('El valor_base debe ser mayor que 0');
    }
    if (props.vigenciaDesde >= props.vigenciaHasta) {
      throw new DomainException('vigencia_desde debe ser anterior a vigencia_hasta');
    }
  }
}
