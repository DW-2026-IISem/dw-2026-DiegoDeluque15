import { Pasajero } from '../entities/pasajero.entity.js';

/**
 * Puerto del repositorio de Pasajero (Inversión de Dependencias).
 * `application` depende de esta interfaz, NO de Sequelize directamente.
 * `infrastructure` es quien la implementa (ver pasajero.repository.ts).
 */
export interface IPasajeroRepository {
  crear(pasajero: Pasajero): Promise<Pasajero>;
  buscarPorId(id: number): Promise<Pasajero | null>;
  listar(soloActivos: boolean): Promise<Pasajero[]>;
  actualizar(pasajero: Pasajero): Promise<Pasajero>;
  tieneCarrerasActivas(id: number): Promise<boolean>;
}

/** Token de inyección de dependencias para este puerto (NestJS no puede inyectar interfaces directamente). */
export const PASAJERO_REPOSITORY = 'PASAJERO_REPOSITORY';
