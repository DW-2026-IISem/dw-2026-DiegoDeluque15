import {
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CarreraModel } from '../../../../../trips/infrastructure/persistence/models/carrera.model';

@Table({
  tableName: 'liquidaciones',
  timestamps: false,
  underscored: true,
})
export class LiquidacionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.DATE, allowNull: false })
  fecha: Date;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    get() {
      const val = this.getDataValue('valor');
      return val === null ? null : Number(val);
    },
  })
  valor: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  estado: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  observaciones: string;

  @HasMany(() => CarreraModel, 'liquidacion_id')
  carreras: CarreraModel[];
}
