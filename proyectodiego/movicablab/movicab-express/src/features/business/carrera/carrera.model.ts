import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export type CarreraEstado = "solicitada" | "aceptada" | "en_curso" | "cerrada" | "cancelada";

export interface CarreraI {
  id?: number;
  pasajero_id: number;
  turno_id: number;
  tarifa_id: number;
  fecha_inicio?: Date;
  fecha_fin?: Date | null;
  total?: number | null;
  estado?: CarreraEstado;
  observaciones?: string | null;
  liquidacion_id?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Carrera extends Model {
  public id!: number;
  public pasajero_id!: number;
  public turno_id!: number;
  public tarifa_id!: number;
  public fecha_inicio!: Date;
  public fecha_fin!: Date | null;
  public total!: number | null;
  public estado!: CarreraEstado;
  public observaciones!: string | null;
  public liquidacion_id!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Carrera.init(
  {
    pasajero_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "pasajeros", key: "id" },
    },
    turno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "turnos", key: "id" },
    },
    tarifa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "tarifas", key: "id" },
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
    },
    estado: {
      type: DataTypes.ENUM("solicitada", "aceptada", "en_curso", "cerrada", "cancelada"),
      defaultValue: "solicitada",
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    liquidacion_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      // FK a liquidaciones se activa en ISS-15
    },
  },
  {
    sequelize,
    modelName: "Carrera",
    tableName: "carreras",
    timestamps: true,
  }
);
