import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface DriverI {
  id?: number;
  name: string;
  description?: string | null;
  company_id?: number | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Driver extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public company_id!: number | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Driver.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 255],
          msg: "name must be at least 2 characters",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "companies",
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
    modelName: "Driver",
    tableName: "drivers",
    timestamps: true,
  }
);
