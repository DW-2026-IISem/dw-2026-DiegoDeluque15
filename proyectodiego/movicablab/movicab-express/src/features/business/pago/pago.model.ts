import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface PagoI {
  id?: number;
  referencia_tipo: string;
  referencia_id: number;
  metodo: string;
  monto: number;
  fecha?: Date;
  estado?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Pago extends Model {
  public id!: number;
  public referencia_tipo!: string;
  public referencia_id!: number;
  public metodo!: string;
  public monto!: number;
  public fecha!: Date;
  public estado!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pago.init(
  {
    referencia_tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "carrera",
    },
    referencia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // SIN FK física — polimórfico por diseño, integridad en controller
    },
    metodo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "registrado",
    },
  },
  {
    sequelize,
    modelName: "Pago",
    tableName: "pagos",
    timestamps: true,
  }
);
