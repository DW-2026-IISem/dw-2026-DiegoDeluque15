import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";
import bcrypt from "bcryptjs";

export interface PasajeroI {
  id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Pasajero extends Model {
  public id!: number;
  public name!: string;
  public address!: string;
  public phone!: string;
  public email!: string;
  public password!: string;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pasajero.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: "Phone cannot be empty" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: { msg: "Email must be a valid email address" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Pasajero",
    tableName: "pasajeros",
    timestamps: true,
    hooks: {
      beforeCreate: async (pasajero: Pasajero) => {
        if (pasajero.password) {
          const salt = await bcrypt.genSalt(10);
          pasajero.password = await bcrypt.hash(pasajero.password, salt);
        }
      },
      beforeUpdate: async (pasajero: Pasajero) => {
        if (pasajero.changed("password") && pasajero.password) {
          const salt = await bcrypt.genSalt(10);
          pasajero.password = await bcrypt.hash(pasajero.password, salt);
        }
      },
      beforeBulkCreate: async (pasajeros: Pasajero[]) => {
        for (const pasajero of pasajeros) {
          if (pasajero.password) {
            const salt = await bcrypt.genSalt(10);
            pasajero.password = await bcrypt.hash(pasajero.password, salt);
          }
        }
      },
    },
  }
);