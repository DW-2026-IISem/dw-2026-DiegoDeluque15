export interface LiquidacionProps {
  id?: number;
  fecha: Date;
  valor: number;
  estado: string;
  observaciones?: string;
}

export class Liquidacion {
  constructor(private readonly props: LiquidacionProps) {}

  get id() { return this.props.id; }
  get fecha() { return this.props.fecha; }
  get valor() { return this.props.valor; }
  get estado() { return this.props.estado; }
  get observaciones() { return this.props.observaciones; }

  toJSON(): LiquidacionProps {
    return { ...this.props };
  }
}
