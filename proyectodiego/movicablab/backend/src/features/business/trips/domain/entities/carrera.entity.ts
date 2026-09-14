import { EstadoInvalidoException } from '../exceptions/estado-invalido.exception';

export type CarreraEstado = 'solicitada' | 'aceptada' | 'en_curso' | 'cerrada' | 'cancelada';

export interface CarreraProps {
  id: number;
  pasajeroId: number;
  turnoId: number;
  tarifaId: number;
  fechaInicio: Date;
  fechaFin?: Date;
  total?: number;
  estado: CarreraEstado;
  observaciones?: string;
  liquidacionId?: number;
}

export interface CarreraCreateProps {
  pasajeroId: number;
  turnoId: number;
  tarifaId: number;
  fechaInicio: Date;
  observaciones?: string;
}

export class Carrera {
  readonly id: number;
  readonly pasajeroId: number;
  readonly turnoId: number;
  readonly tarifaId: number;
  fechaInicio: Date;
  fechaFin?: Date;
  total?: number;
  #estado: CarreraEstado;
  observaciones?: string;
  liquidacionId?: number;

  constructor(props: CarreraProps) {
    this.id = props.id;
    this.pasajeroId = props.pasajeroId;
    this.turnoId = props.turnoId;
    this.tarifaId = props.tarifaId;
    this.fechaInicio = props.fechaInicio;
    this.fechaFin = props.fechaFin;
    this.total = props.total;
    this.#estado = props.estado;
    this.observaciones = props.observaciones;
    this.liquidacionId = props.liquidacionId;
  }

  static create(props: CarreraCreateProps): CarreraProps {
    return {
      ...props,
      id: 0,
      estado: 'solicitada',
    };
  }

  get estado(): CarreraEstado {
    return this.#estado;
  }

  cambiarEstado(nuevoEstado: CarreraEstado): void {
    if (this.#estado === nuevoEstado) return;

    const validTransitions: Record<CarreraEstado, CarreraEstado[]> = {
      solicitada: ['aceptada', 'cancelada'],
      aceptada: ['en_curso', 'cancelada'],
      en_curso: ['cerrada'],
      cerrada: [],
      cancelada: [],
    };

    const allowed = validTransitions[this.#estado];
    if (!allowed || !allowed.includes(nuevoEstado)) {
      throw new EstadoInvalidoException(`Transición inválida de estado: de '${this.#estado}' a '${nuevoEstado}'`);
    }

    this.#estado = nuevoEstado;
  }
}
