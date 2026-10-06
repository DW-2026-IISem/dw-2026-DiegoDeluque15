import { Carrera } from "./carrera.model";
import { Pasajero } from "../pasajero/pasajero.model";
import { Turno } from "../turno/turno.model";
import { Tarifa } from "../tarifa/tarifa.model";

export function setupCarreraAssociations(): void {
  Carrera.belongsTo(Pasajero, { foreignKey: "pasajero_id", as: "pasajero" });
  Pasajero.hasMany(Carrera, { foreignKey: "pasajero_id", as: "carreras" });

  Carrera.belongsTo(Turno, { foreignKey: "turno_id", as: "turno" });
  Turno.hasMany(Carrera, { foreignKey: "turno_id", as: "carreras" });

  Carrera.belongsTo(Tarifa, { foreignKey: "tarifa_id", as: "tarifa" });
  Tarifa.hasMany(Carrera, { foreignKey: "tarifa_id", as: "carreras" });
}
