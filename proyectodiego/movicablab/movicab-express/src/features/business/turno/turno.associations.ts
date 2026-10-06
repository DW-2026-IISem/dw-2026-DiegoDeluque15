import { Turno } from "./turno.model";
import { Conductor } from "../conductor/conductor.model";
import { Vehiculo } from "../vehiculo/vehiculo.model";

export function setupTurnoAssociations(): void {
  Turno.belongsTo(Conductor, {
    foreignKey: "conductor_id",
    as: "conductor",
  });

  Conductor.hasMany(Turno, {
    foreignKey: "conductor_id",
    as: "turnos",
  });

  Turno.belongsTo(Vehiculo, {
    foreignKey: "vehiculo_id",
    as: "vehiculo",
  });

  Vehiculo.hasMany(Turno, {
    foreignKey: "vehiculo_id",
    as: "turnos",
  });
}
