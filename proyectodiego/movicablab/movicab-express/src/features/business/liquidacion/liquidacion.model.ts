import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface LiquidacionI {
  id?: number;
  conductor_id: number;
  fecha_desde: Date;
  fecha_hasta: Date;
  fecha?: Date;
  valor: number;
  estado?: string;
  observaciones?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Liquidacion extends Model {
  public id!: number;
  public conductor_id!: number;
  public fecha_desde!: Date;
  public fecha_hasta!: Date;
  public fecha!: Date;
  public valor!: number;
  public estado!: string;
  public observaciones!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Liquidacion.init(
  {
    conductor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "conductores", key: "id" },
    },
    fecha_desde: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_hasta: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "generada",
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "Liquidacion",
    tableName: "liquidaciones",
    timestamps: true,
  }
);
