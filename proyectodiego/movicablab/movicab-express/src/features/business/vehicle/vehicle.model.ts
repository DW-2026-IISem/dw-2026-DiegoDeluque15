import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface VehicleI {
  id?: number;
  name: string;
  description?: string | null;
  company_id: number;
  vehicle_type_id?: number | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Vehicle extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public company_id!: number;
  public vehicle_type_id!: number | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vehicle.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "companies",
        key: "id",
      },
    },
    vehicle_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "vehicle_types",
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
    modelName: "Vehicle",
    tableName: "vehicles",
    timestamps: true,
  }
);
