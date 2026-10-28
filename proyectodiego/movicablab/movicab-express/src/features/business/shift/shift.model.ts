import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface ShiftI {
  id?: number;
  name: string;
  description?: string | null;
  driver_id: number;
  vehicle_id: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Shift extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public driver_id!: number;
  public vehicle_id!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Shift.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "drivers",
        key: "id",
      },
    },
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vehicles",
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
    modelName: "Shift",
    tableName: "shifts",
    timestamps: true,
  }
);
