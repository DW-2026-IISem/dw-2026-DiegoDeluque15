import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ConductorModel } from '../../../../conductores/infrastructure/persistence/models/conductor.model';
import { VehiculoModel } from '../../../../../fleets/vehiculos/infrastructure/persistence/models/vehiculo.model';

@Table({
  tableName: 'turnos',
  timestamps: true,
  underscored: true,
})
export class TurnoModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  nombre: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  descripcion: string | null;

  @Column({ field: 'is_active', type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  @ForeignKey(() => ConductorModel)
  @Column({ field: 'conductor_id', type: DataType.INTEGER, allowNull: false })
  conductorId: number;

  @BelongsTo(() => ConductorModel)
  conductor: ConductorModel;

  @ForeignKey(() => VehiculoModel)
  @Column({ field: 'vehiculo_id', type: DataType.INTEGER, allowNull: false })
  vehiculoId: number;

  @BelongsTo(() => VehiculoModel)
  vehiculo: VehiculoModel;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
