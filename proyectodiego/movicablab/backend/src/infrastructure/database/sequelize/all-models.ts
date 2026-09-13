import { ModelCtor } from 'sequelize-typescript';
import { PasajeroModel } from '../../../features/business/passengers/infrastructure/persistence/models/pasajero.model';

/**
 * Registro central de modelos Sequelize.
 * Cada issue de feature añade aquí sus models (ISS-03+).
 */
export const ALL_MODELS: ModelCtor[] = [PasajeroModel];
