import { ModelCtor } from 'sequelize-typescript';
import { PasajeroModel } from '../../../features/business/passengers/infrastructure/persistence/models/pasajero.model';
import { EmpresaModel } from '../../../features/business/fleets/empresas/infrastructure/persistence/models/empresa.model';

/**
 * Registro central de modelos Sequelize.
 * Cada issue de feature añade aquí sus models (ISS-03+).
 */
export const ALL_MODELS: ModelCtor[] = [PasajeroModel, EmpresaModel];
