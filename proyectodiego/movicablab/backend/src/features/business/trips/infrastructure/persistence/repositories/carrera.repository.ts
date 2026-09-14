import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Carrera, CarreraProps } from '../../../domain/entities/carrera.entity';
import { ICarreraRepository, PaginationParams, ListCarrerasFilters } from '../../../domain/interfaces/carrera.repository.interface';
import { PaginatedResult } from '../../../../../../common/interfaces/paginated-result.interface';
import { CarreraPersistenceMapper } from '../mappers/carrera.persistence-mapper';
import { CarreraModel } from '../models/carrera.model';

@Injectable()
export class CarreraRepository implements ICarreraRepository {
  async create(props: Omit<CarreraProps, 'id'>): Promise<Carrera> {
    const model = await CarreraModel.create({ ...props });
    return CarreraPersistenceMapper.toDomain(model);
  }

  async findById(id: number): Promise<Carrera | null> {
    const model = await CarreraModel.findByPk(id);
    return model ? CarreraPersistenceMapper.toDomain(model) : null;
  }

  async findAll(pagination: PaginationParams, filters?: ListCarrerasFilters): Promise<PaginatedResult<Carrera>> {
    const page = pagination.page;
    const limit = pagination.limit;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (filters?.estado) where.estado = filters.estado;
    if (filters?.pasajeroId) where.pasajeroId = filters.pasajeroId;
    if (filters?.turnoId) where.turnoId = filters.turnoId;
    
    if (filters?.fechaInicioDesde || filters?.fechaInicioHasta) {
      where.fechaInicio = {};
      if (filters.fechaInicioDesde) where.fechaInicio[Op.gte] = filters.fechaInicioDesde;
      if (filters.fechaInicioHasta) where.fechaInicio[Op.lte] = filters.fechaInicioHasta;
    }

    const { rows, count } = await CarreraModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['fechaInicio', 'DESC']],
    });

    return {
      items: rows.map((row) => CarreraPersistenceMapper.toDomain(row)),
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async update(id: number, props: Partial<CarreraProps>): Promise<Carrera | null> {
    const model = await CarreraModel.findByPk(id);
    if (!model) return null;

    if (props.estado !== undefined) model.estado = props.estado;
    if (props.fechaFin !== undefined) model.fechaFin = props.fechaFin;
    if (props.total !== undefined) model.total = props.total;

    await model.save();
    return CarreraPersistenceMapper.toDomain(model);
  }
}
