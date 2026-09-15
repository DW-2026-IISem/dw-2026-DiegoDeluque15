import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { CarreraModel } from '../../../../../trips/infrastructure/persistence/models/carrera.model';
import { CalificacionProps } from '../../../domain/entities/calificacion.entity';

@Table({
  tableName: 'calificaciones',
  timestamps: false,
  underscored: true,
})
export class CalificacionModel extends Model<CalificacionModel> implements CalificacionProps {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => CarreraModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'carrera_id',
    unique: true,
  })
  carreraId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  puntaje: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  comentario?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive: boolean;
}
