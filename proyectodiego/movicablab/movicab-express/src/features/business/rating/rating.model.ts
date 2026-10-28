import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface RatingI {
  id?: number;
  trip_id: number;
  score: number;
  comment?: string | null;
  status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Rating extends Model {
  public id!: number;
  public trip_id!: number;
  public score!: number;
  public comment!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Rating.init(
  {
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // A trip has at most one rating
      references: { model: "trips", key: "id" },
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    comment: {
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
    modelName: "Rating",
    tableName: "ratings",
    timestamps: true,
  }
);
