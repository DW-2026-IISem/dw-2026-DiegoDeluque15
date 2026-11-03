import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface CompanyI {
  id?: number;
  tax_id: string;
  legal_name: string;
  primary_contact?: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Company extends Model {
  public id!: number;
  public tax_id!: string;
  public legal_name!: string;
  public primary_contact!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Company.init(
  {
    tax_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    legal_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    primary_contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Company",
    tableName: "companies",
    timestamps: true,
  }
);
