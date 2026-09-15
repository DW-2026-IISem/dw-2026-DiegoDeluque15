export interface PagoProps {
  id: number;
  referenciaTipo: string;
  referenciaId: number;
  metodo: string;
  monto: number;
  fecha: Date;
  estado: string;
}

export interface PagoCreateProps {
  referenciaTipo: string;
  referenciaId: number;
  metodo: string;
  monto: number;
}

export class Pago {
  readonly id: number;
  readonly referenciaTipo: string;
  readonly referenciaId: number;
  readonly metodo: string;
  readonly monto: number;
  readonly fecha: Date;
  #estado: string;

  constructor(props: PagoProps) {
    this.id = props.id;
    this.referenciaTipo = props.referenciaTipo;
    this.referenciaId = props.referenciaId;
    this.metodo = props.metodo;
    this.monto = props.monto;
    this.fecha = props.fecha;
    this.#estado = props.estado;
  }

  static create(props: PagoCreateProps): PagoProps {
    return {
      ...props,
      id: 0,
      fecha: new Date(),
      estado: 'pendiente',
    };
  }

  get estado(): string {
    return this.#estado;
  }
}
