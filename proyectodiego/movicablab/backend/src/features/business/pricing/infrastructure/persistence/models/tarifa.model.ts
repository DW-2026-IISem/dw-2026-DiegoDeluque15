import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'tarifas',
  timestamps: false,
  underscored: true,
})
export class TarifaModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  nombre: string;

  @Column({ field: 'regla_calculo', type: DataType.STRING(100), allowNull: false })
  reglaCalculo: string;

  @Column({ field: 'valor_base', type: DataType.DECIMAL(10, 2), allowNull: false })
  valorBase: number;

  @Column({ field: 'vigencia_desde', type: DataType.DATE, allowNull: false })
  vigenciaDesde: Date;

  @Column({ field: 'vigencia_hasta', type: DataType.DATE, allowNull: false })
  vigenciaHasta: Date;

  @Column({ field: 'is_active', type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;
}
