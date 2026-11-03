import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface SettlementI {
  id?: number;
  driver_id: number;
  date_from: Date;
  date_to: Date;
  generated_at?: Date;
  total_amount: number;
  status?: string;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Settlement extends Model {
  public id!: number;
  public driver_id!: number;
  public date_from!: Date;
  public date_to!: Date;
  public generated_at!: Date;
  public total_amount!: number;
  public status!: string;
  public notes!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Settlement.init(
  {
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "drivers", key: "id" },
    },
    date_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_to: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    generated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "generada",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "Settlement",
    tableName: "settlements",
    timestamps: true,
  }
);
