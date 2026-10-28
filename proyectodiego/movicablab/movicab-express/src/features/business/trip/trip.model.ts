import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export type TripStatus = "solicitada" | "aceptada" | "en_curso" | "cerrada" | "cancelada";

export interface TripI {
  id?: number;
  passenger_id: number;
  shift_id: number;
  fare_id: number;
  started_at?: Date;
  ended_at?: Date | null;
  total?: number | null;
  status?: TripStatus;
  notes?: string | null;
  settlement_id?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Trip extends Model {
  public id!: number;
  public passenger_id!: number;
  public shift_id!: number;
  public fare_id!: number;
  public started_at!: Date;
  public ended_at!: Date | null;
  public total!: number | null;
  public status!: TripStatus;
  public notes!: string | null;
  public settlement_id!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Trip.init(
  {
    passenger_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "passengers", key: "id" },
    },
    shift_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "shifts", key: "id" },
    },
    fare_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "fares", key: "id" },
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ended_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM("solicitada", "aceptada", "en_curso", "cerrada", "cancelada"),
      defaultValue: "solicitada",
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    settlement_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: { model: "settlements", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Trip",
    tableName: "trips",
    timestamps: true,
  }
);
