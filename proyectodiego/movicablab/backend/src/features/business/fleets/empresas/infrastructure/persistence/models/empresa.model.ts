import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'empresas',
  timestamps: false,
  underscored: true,
})
export class EmpresaModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  nit: string;

  @Column({ field: 'razon_social', type: DataType.STRING(255), allowNull: false })
  razonSocial: string;

  @Column({ field: 'contacto_principal', type: DataType.STRING(255), allowNull: true })
  contactoPrincipal: string | null;

  @Column({ field: 'is_active', type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

}
