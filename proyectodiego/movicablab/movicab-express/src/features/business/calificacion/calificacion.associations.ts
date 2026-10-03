import { Calificacion } from "./calificacion.model";
import { Carrera } from "../carrera/carrera.model";

export function setupCalificacionAssociations(): void {
  Calificacion.belongsTo(Carrera, { foreignKey: "carrera_id", as: "carrera" });
  Carrera.hasOne(Calificacion, { foreignKey: "carrera_id", as: "calificacion" });
}
