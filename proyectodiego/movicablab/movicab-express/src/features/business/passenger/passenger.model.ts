import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";
import bcrypt from "bcryptjs";

export interface PassengerI {
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

export class Passenger extends Model {
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

Passenger.init(
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
    modelName: "Passenger",
    tableName: "passengers",
    timestamps: true,
    hooks: {
      beforeCreate: async (passenger: Passenger) => {
        if (passenger.password) {
          const salt = await bcrypt.genSalt(10);
          passenger.password = await bcrypt.hash(passenger.password, salt);
        }
      },
      beforeUpdate: async (passenger: Passenger) => {
        if (passenger.changed("password") && passenger.password) {
          const salt = await bcrypt.genSalt(10);
          passenger.password = await bcrypt.hash(passenger.password, salt);
        }
      },
      beforeBulkCreate: async (passengers: Passenger[]) => {
        for (const passenger of passengers) {
          if (passenger.password) {
            const salt = await bcrypt.genSalt(10);
            passenger.password = await bcrypt.hash(passenger.password, salt);
          }
        }
      },
    },
  }
);
