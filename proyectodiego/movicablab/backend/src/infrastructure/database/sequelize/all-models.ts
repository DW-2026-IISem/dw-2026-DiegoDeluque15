import { PagoModel } from '../../../features/business/settlements/pagos/infrastructure/persistence/models/pago.model';
import { CalificacionModel } from '../../../features/business/settlements/calificaciones/infrastructure/persistence/models/calificacion.model';
import { ModelCtor } from 'sequelize-typescript';
import { PasajeroModel } from '../../../features/business/passengers/infrastructure/persistence/models/pasajero.model';
import { EmpresaModel } from '../../../features/business/fleets/empresas/infrastructure/persistence/models/empresa.model';
import { VehiculoModel } from '../../../features/business/fleets/vehiculos/infrastructure/persistence/models/vehiculo.model';
import { ConductorModel } from '../../../features/business/drivers/conductores/infrastructure/persistence/models/conductor.model';
import { TurnoModel } from '../../../features/business/drivers/turnos/infrastructure/persistence/models/turno.model';
import { TarifaModel } from '../../../features/business/pricing/infrastructure/persistence/models/tarifa.model';
import { CarreraModel } from '../../../features/business/trips/infrastructure/persistence/models/carrera.model';

/**
 * Registro central de modelos Sequelize.
 * Cada issue de feature añade aquí sus models (ISS-03+).
 */
export const ALL_MODELS: ModelCtor[] = [PasajeroModel, EmpresaModel, VehiculoModel, ConductorModel, TurnoModel, TarifaModel, CarreraModel, PagoModel, CalificacionModel];
