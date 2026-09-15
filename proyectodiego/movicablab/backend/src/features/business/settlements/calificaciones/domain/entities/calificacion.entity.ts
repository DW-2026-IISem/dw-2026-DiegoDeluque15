export interface CalificacionProps {
  id: number;
  carreraId: number;
  puntaje: number;
  comentario?: string;
  isActive: boolean;
}

export interface CalificacionCreateProps {
  carreraId: number;
  puntaje: number;
  comentario?: string;
}

export class Calificacion {
  readonly id: number;
  readonly carreraId: number;
  puntaje: number;
  comentario?: string;
  isActive: boolean;

  constructor(props: CalificacionProps) {
    this.id = props.id;
    this.carreraId = props.carreraId;
    this.puntaje = props.puntaje;
    this.comentario = props.comentario;
    this.isActive = props.isActive;
  }

  static create(props: CalificacionCreateProps): CalificacionProps {
    return {
      ...props,
      id: 0,
      isActive: true,
    };
  }
}
