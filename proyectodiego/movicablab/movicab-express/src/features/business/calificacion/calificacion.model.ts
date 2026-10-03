import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface CalificacionI {
  id?: number;
  carrera_id: number;
  puntaje: number;
  comentario?: string | null;
  status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Calificacion extends Model {
  public id!: number;
  public carrera_id!: number;
  public puntaje!: number;
  public comentario!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Calificacion.init(
  {
    carrera_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Una carrera tiene maximo una calificacion
      references: { model: "carreras", key: "id" },
    },
    puntaje: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Calificacion",
    tableName: "calificaciones",
    timestamps: true,
  }
);
