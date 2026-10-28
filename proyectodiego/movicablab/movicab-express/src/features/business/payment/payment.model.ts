import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface PaymentI {
  id?: number;
  reference_type: string;
  reference_id: number;
  payment_method: string;
  amount: number;
  paid_at?: Date;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Payment extends Model {
  public id!: number;
  public reference_type!: string;
  public reference_id!: number;
  public payment_method!: string;
  public amount!: number;
  public paid_at!: Date;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    reference_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "carrera",
    },
    reference_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // SIN FK física — polimórfico por diseño, integridad en controller
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "registrado",
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "payments",
    timestamps: true,
  }
);
