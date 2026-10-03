import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface VehiculoI {
  id?: number;
  nombre: string;
  descripcion?: string | null;
  empresa_id: number;
  tipo_vehiculo_id?: number | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Vehiculo extends Model {
  public id!: number;
  public nombre!: string;
  public descripcion!: string | null;
  public empresa_id!: number;
  public tipo_vehiculo_id!: number | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vehiculo.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    empresa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "empresas",
        key: "id",
      },
    },
    tipo_vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tipos_vehiculo",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Vehiculo",
    tableName: "vehiculos",
    timestamps: true,
  }
);
