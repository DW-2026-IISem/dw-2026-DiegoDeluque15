import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { CarreraModel } from '../../../../../trips/infrastructure/persistence/models/carrera.model';
import { PagoProps } from '../../../domain/entities/pago.entity';

@Table({
  tableName: 'pagos',
  timestamps: false,
  underscored: true,
})
export class PagoModel extends Model<PagoModel> implements PagoProps {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'referencia_tipo',
  })
  referenciaTipo: string;

  @ForeignKey(() => CarreraModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'referencia_id',
  })
  referenciaId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  metodo: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    get() {
      const value = this.getDataValue('monto');
      return value === null ? null : parseFloat(value as any);
    }
  })
  monto: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  fecha: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  estado: string;
}
