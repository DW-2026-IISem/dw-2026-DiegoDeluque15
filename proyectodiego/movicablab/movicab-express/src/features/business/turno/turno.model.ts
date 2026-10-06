import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface TurnoI {
  id?: number;
  nombre: string;
  descripcion?: string | null;
  conductor_id: number;
  vehiculo_id: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Turno extends Model {
  public id!: number;
  public nombre!: string;
  public descripcion!: string | null;
  public conductor_id!: number;
  public vehiculo_id!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Turno.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    conductor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "conductores",
        key: "id",
      },
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vehiculos",
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
    modelName: "Turno",
    tableName: "turnos",
    timestamps: true,
  }
);
