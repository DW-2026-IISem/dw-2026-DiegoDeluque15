import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface EmpresaI {
  id?: number;
  nit: string;
  razon_social: string;
  contacto_principal?: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Empresa extends Model {
  public id!: number;
  public nit!: string;
  public razon_social!: string;
  public contacto_principal!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Empresa.init(
  {
    nit: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    razon_social: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contacto_principal: {
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
    modelName: "Empresa",
    tableName: "empresas",
    timestamps: true,
  }
);
