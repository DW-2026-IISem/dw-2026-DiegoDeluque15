import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface TarifaI {
  id?: number;
  nombre: string;
  regla_calculo: string;
  valor_base: number;
  vigencia_desde: Date;
  vigencia_hasta: Date;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Tarifa extends Model {
  public id!: number;
  public nombre!: string;
  public regla_calculo!: string;
  public valor_base!: number;
  public vigencia_desde!: Date;
  public vigencia_hasta!: Date;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Tarifa.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regla_calculo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    valor_base: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    vigencia_desde: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    vigencia_hasta: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Tarifa",
    tableName: "tarifas",
    timestamps: true,
  }
);
