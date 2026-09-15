import { UserModel } from '../../../features/identity/users/infrastructure/persistence/models/users.model';
import { RoleModel } from '../../../features/identity/roles/infrastructure/persistence/models/roles.model';
import { RoleUserModel } from '../../../features/identity/role-users/infrastructure/persistence/models/role-users.model';
import { ResourceModel } from '../../../features/identity/resources/infrastructure/persistence/models/resources.model';
import { ResourceRoleModel } from '../../../features/identity/resource-roles/infrastructure/persistence/models/resource-roles.model';
import { RefreshTokenModel } from '../../../features/identity/refresh-tokens/infrastructure/persistence/models/refresh-tokens.model';
import { LiquidacionModel } from '../../../features/business/settlements/liquidaciones/infrastructure/persistence/models/liquidacion.model';
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
export const ALL_MODELS: ModelCtor[] = [
  UserModel, RoleModel, RoleUserModel, ResourceModel, ResourceRoleModel, RefreshTokenModel,PasajeroModel, EmpresaModel, VehiculoModel, ConductorModel, TurnoModel, TarifaModel, CarreraModel, PagoModel, CalificacionModel, LiquidacionModel];
