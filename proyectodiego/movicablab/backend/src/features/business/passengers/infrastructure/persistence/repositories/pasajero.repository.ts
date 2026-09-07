import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pasajero } from '../../../domain/entities/pasajero.entity.js';
import { IPasajeroRepository } from '../../../domain/interfaces/pasajero-repository.interface.js';
import { PasajeroModel } from '../models/pasajero.model.js';

/**
 * Implementación real del puerto IPasajeroRepository usando Sequelize/MySQL.
 * Esta clase traduce entre PasajeroModel (fila de MySQL) y Pasajero (entidad de dominio).
 * Si mañana cambiamos de MySQL a PostgreSQL, solo esta clase cambiaría (o ni eso,
 * ya que Sequelize abstrae el dialecto); domain y application no se enteran.
 */
@Injectable()
export class PasajeroRepository implements IPasajeroRepository {
  constructor(
    @InjectModel(PasajeroModel)
    private readonly pasajeroModel: typeof PasajeroModel,
  ) {}

  /** Convierte una fila de Sequelize en una entidad de dominio Pasajero. */
  private aDominio(modelo: PasajeroModel): Pasajero {
    return new Pasajero(
      modelo.id,
      modelo.nombre,
      modelo.descripcion,
      modelo.isActive,
      modelo.createdAt,
      modelo.updatedAt,
    );
  }

  async crear(pasajero: Pasajero): Promise<Pasajero> {
    const creado = await this.pasajeroModel.create({
      nombre: pasajero.nombre,
      descripcion: pasajero.descripcion,
      isActive: pasajero.isActive,
    });
    return this.aDominio(creado);
  }

  async buscarPorId(id: number): Promise<Pasajero | null> {
    const encontrado = await this.pasajeroModel.findByPk(id);
    return encontrado ? this.aDominio(encontrado) : null;
  }

  async listar(soloActivos: boolean): Promise<Pasajero[]> {
    const filtro = soloActivos ? { where: { isActive: true } } : {};
    const resultados = await this.pasajeroModel.findAll(filtro);
    return resultados.map((r) => this.aDominio(r));
  }

  async actualizar(pasajero: Pasajero): Promise<Pasajero> {
    await this.pasajeroModel.update(
      {
        nombre: pasajero.nombre,
        descripcion: pasajero.descripcion,
        isActive: pasajero.isActive,
      },
      { where: { id: pasajero.id! } },
    );
    const actualizado = await this.pasajeroModel.findByPk(pasajero.id!);
    return this.aDominio(actualizado!);
  }

  /**
   * Verifica la regla de negocio: no se puede desactivar un Pasajero
   * con Carreras en curso o aceptadas.
   * NOTA: por ahora devuelve false (placeholder), porque la entidad
   * Carrera todavía no existe. Se completará cuando construyamos `trips`.
   */
  async tieneCarrerasActivas(_id: number): Promise<boolean> {
    return false;
  }
}
