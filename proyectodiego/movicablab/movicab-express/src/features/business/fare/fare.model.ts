import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface FareI {
  id?: number;
  name: string;
  calculation_rule: string;
  base_value: number;
  valid_from: Date;
  valid_until: Date;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Fare extends Model {
  public id!: number;
  public name!: string;
  public calculation_rule!: string;
  public base_value!: number;
  public valid_from!: Date;
  public valid_until!: Date;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Fare.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    calculation_rule: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    base_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    valid_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    valid_until: {
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
    modelName: "Fare",
    tableName: "fares",
    timestamps: true,
  }
);
