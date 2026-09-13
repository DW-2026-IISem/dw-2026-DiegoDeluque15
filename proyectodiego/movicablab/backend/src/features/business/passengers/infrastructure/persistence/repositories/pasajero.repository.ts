import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import {
  Pasajero,
  PasajeroCreateProps,
  PasajeroUpdateProps,
} from '../../../domain/entities/pasajero.entity';
import {
  IPasajeroRepository,
  PasajeroListFilters,
  PaginationParams,
} from '../../../domain/interfaces/pasajero.repository.interface';
import { PaginatedResult } from '../../../../../../common/interfaces/paginated-result.interface';
import { PasajeroPersistenceMapper } from '../mappers/pasajero.persistence-mapper';
import { PasajeroModel } from '../models/pasajero.model';

@Injectable()
export class PasajeroRepository implements IPasajeroRepository {
  async create(props: PasajeroCreateProps): Promise<Pasajero> {
    const model = await PasajeroModel.create({
      nombre: props.nombre,
      descripcion: props.descripcion ?? null,
      isActive: true,
    });

    return PasajeroPersistenceMapper.toDomain(model);
  }

  async findById(id: number): Promise<Pasajero | null> {
    const model = await PasajeroModel.findByPk(id);
    return model ? PasajeroPersistenceMapper.toDomain(model) : null;
  }

  async findAll(
    filters: PasajeroListFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Pasajero>> {
    const where: WhereOptions = {};

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const page = pagination.page;
    const limit = pagination.limit;
    const offset = (page - 1) * limit;

    const { rows, count } = await PasajeroModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    return {
      items: rows.map((row) => PasajeroPersistenceMapper.toDomain(row)),
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async update(id: number, props: PasajeroUpdateProps): Promise<Pasajero | null> {
    const model = await PasajeroModel.findByPk(id);

    if (!model) {
      return null;
    }

    if (props.nombre !== undefined) {
      model.nombre = props.nombre;
    }

    if (props.descripcion !== undefined) {
      model.descripcion = props.descripcion;
    }

    await model.save();

    return PasajeroPersistenceMapper.toDomain(model);
  }

  async softDelete(id: number): Promise<Pasajero | null> {
    const model = await PasajeroModel.findByPk(id);

    if (!model) {
      return null;
    }

    model.isActive = false;
    await model.save();

    return PasajeroPersistenceMapper.toDomain(model);
  }
}
