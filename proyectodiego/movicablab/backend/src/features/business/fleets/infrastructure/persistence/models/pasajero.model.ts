import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

/**
 * Modelo Sequelize: mapea la entidad Pasajero a la tabla `pasajeros` de MySQL.
 * Esta clase SÍ conoce Sequelize (a diferencia de la entidad de dominio),
 * porque vive en la capa `infrastructure`, cuyo trabajo es hablar con la BD.
 */
@Table({ tableName: 'pasajeros', timestamps: true, underscored: true })
export class PasajeroModel extends Model {
  @Column({
    type: DataType.STRING(120),
    allowNull: false,
  })
  declare nombre: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare descripcion: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  declare isActive: boolean;
}
