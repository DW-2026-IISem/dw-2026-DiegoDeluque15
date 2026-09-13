import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Tarifa, TarifaCreateProps, TarifaUpdateProps } from '../../../domain/entities/tarifa.entity';
import { ITarifaRepository, PaginationParams } from '../../../domain/interfaces/tarifa.repository.interface';
import { PaginatedResult } from '../../../../../../common/interfaces/paginated-result.interface';
import { TarifaPersistenceMapper } from '../mappers/tarifa.persistence-mapper';
import { TarifaModel } from '../models/tarifa.model';

@Injectable()
export class TarifaRepository implements ITarifaRepository {
  async create(props: TarifaCreateProps): Promise<Tarifa> {
    const model = await TarifaModel.create({
      ...props,
      isActive: true,
    });
    return TarifaPersistenceMapper.toDomain(model);
  }

  async findById(id: number): Promise<Tarifa | null> {
    const model = await TarifaModel.findByPk(id);
    return model ? TarifaPersistenceMapper.toDomain(model) : null;
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<Tarifa>> {
    const page = pagination.page;
    const limit = pagination.limit;
    const offset = (page - 1) * limit;

    const { rows, count } = await TarifaModel.findAndCountAll({
      limit,
      offset,
      order: [['vigenciaDesde', 'DESC']],
    });

    return {
      items: rows.map((row) => TarifaPersistenceMapper.toDomain(row)),
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async update(id: number, props: TarifaUpdateProps): Promise<Tarifa | null> {
    const model = await TarifaModel.findByPk(id);
    if (!model) return null;

    if (props.nombre !== undefined) model.nombre = props.nombre;
    if (props.reglaCalculo !== undefined) model.reglaCalculo = props.reglaCalculo;
    if (props.valorBase !== undefined) model.valorBase = props.valorBase;
    if (props.vigenciaDesde !== undefined) model.vigenciaDesde = props.vigenciaDesde;
    if (props.vigenciaHasta !== undefined) model.vigenciaHasta = props.vigenciaHasta;

    await model.save();
    return TarifaPersistenceMapper.toDomain(model);
  }

  async softDelete(id: number): Promise<Tarifa | null> {
    const model = await TarifaModel.findByPk(id);
    if (!model) return null;

    model.isActive = false;
    await model.save();
    return TarifaPersistenceMapper.toDomain(model);
  }

  async hasOverlap(reglaCalculo: string, desde: Date, hasta: Date, excludeId?: number): Promise<boolean> {
    const where: any = {
      reglaCalculo,
      isActive: true,
      [Op.or]: [
        { vigenciaDesde: { [Op.between]: [desde, hasta] } },
        { vigenciaHasta: { [Op.between]: [desde, hasta] } },
        { 
          vigenciaDesde: { [Op.lte]: desde }, 
          vigenciaHasta: { [Op.gte]: hasta } 
        }
      ],
    };

    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const count = await TarifaModel.count({ where });
    return count > 0;
  }

  async findVigente(fechaActual: Date): Promise<Tarifa | null> {
    const model = await TarifaModel.findOne({
      where: {
        isActive: true,
        vigenciaDesde: { [Op.lte]: fechaActual },
        vigenciaHasta: { [Op.gte]: fechaActual },
      },
      order: [['vigenciaDesde', 'DESC']],
    });

    return model ? TarifaPersistenceMapper.toDomain(model) : null;
  }
}
