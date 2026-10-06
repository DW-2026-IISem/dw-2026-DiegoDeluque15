import { Vehiculo } from "./vehiculo.model";
import { Empresa } from "../empresa/empresa.model";
import { TipoVehiculo } from "../tipo-vehiculo/tipo-vehiculo.model";

/**
 * Asociaciones del feature Vehiculo.
 * Se carga desde `config/index.ts` DESPUES de definir todos los modelos.
 */
export function setupVehiculoAssociations(): void {
  Vehiculo.belongsTo(Empresa, {
    foreignKey: "empresa_id",
    as: "empresa",
  });

  Empresa.hasMany(Vehiculo, {
    foreignKey: "empresa_id",
    as: "vehiculos",
  });

  Vehiculo.belongsTo(TipoVehiculo, {
    foreignKey: "tipo_vehiculo_id",
    as: "tipo",
  });

  TipoVehiculo.hasMany(Vehiculo, {
    foreignKey: "tipo_vehiculo_id",
    as: "vehiculos",
  });
}
