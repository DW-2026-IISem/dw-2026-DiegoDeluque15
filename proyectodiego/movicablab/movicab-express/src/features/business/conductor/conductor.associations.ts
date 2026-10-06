import { Conductor } from "./conductor.model";
import { Empresa } from "../empresa/empresa.model";

/**
 * Asociaciones del feature Conductor.
 * Se carga desde `config/index.ts` DESPUES de definir ambos modelos.
 */
export function setupConductorAssociations(): void {
  Conductor.belongsTo(Empresa, {
    foreignKey: "empresa_id",
    as: "empresa",
  });

  Empresa.hasMany(Conductor, {
    foreignKey: "empresa_id",
    as: "conductores",
  });
}
