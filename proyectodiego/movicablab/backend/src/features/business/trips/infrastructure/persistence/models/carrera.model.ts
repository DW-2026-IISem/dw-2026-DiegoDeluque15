import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'carreras',
  timestamps: false,
  underscored: true,
})
export class CarreraModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ field: 'pasajero_id', type: DataType.INTEGER, allowNull: false })
  pasajeroId: number;

  @Column({ field: 'turno_id', type: DataType.INTEGER, allowNull: false })
  turnoId: number;

  @Column({ field: 'tarifa_id', type: DataType.INTEGER, allowNull: false })
  tarifaId: number;

  @Column({ field: 'fecha_inicio', type: DataType.DATE, allowNull: false })
  fechaInicio: Date;

  @Column({ field: 'fecha_fin', type: DataType.DATE, allowNull: true })
  fechaFin: Date;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  total: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  estado: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  observaciones: string;

  @Column({ field: 'liquidacion_id', type: DataType.INTEGER, allowNull: true })
  liquidacionId: number;
}
