import { Liquidacion } from "./liquidacion.model";
import { Carrera } from "../carrera/carrera.model";

export function setupLiquidacionAssociations(): void {
  Carrera.belongsTo(Liquidacion, { foreignKey: "liquidacion_id", as: "liquidacion" });
  Liquidacion.hasMany(Carrera, { foreignKey: "liquidacion_id", as: "carreras" });
}
