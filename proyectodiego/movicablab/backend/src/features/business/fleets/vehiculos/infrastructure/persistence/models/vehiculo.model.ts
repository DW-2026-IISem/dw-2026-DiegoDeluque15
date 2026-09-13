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
import { EmpresaModel } from '../../../../empresas/infrastructure/persistence/models/empresa.model';

@Table({
  tableName: 'vehiculos',
  timestamps: true,
  underscored: true,
})
export class VehiculoModel extends Model {
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

  @ForeignKey(() => EmpresaModel)
  @Column({ field: 'empresa_id', type: DataType.INTEGER, allowNull: false })
  empresaId: number;

  @BelongsTo(() => EmpresaModel)
  empresa: EmpresaModel;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
