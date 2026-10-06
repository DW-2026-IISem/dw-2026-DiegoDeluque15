import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface ConductorI {
  id?: number;
  nombre: string;
  descripcion?: string | null;
  empresa_id?: number | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Conductor extends Model {
  public id!: number;
  public nombre!: string;
  public descripcion!: string | null;
  public empresa_id!: number | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Conductor.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 255],
          msg: "nombre must be at least 2 characters",
        },
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    empresa_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "empresas",
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
    modelName: "Conductor",
    tableName: "conductores",
    timestamps: true,
  }
);
