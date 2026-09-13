import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import {
  Turno,
  TurnoCreateProps,
  TurnoUpdateProps,
} from '../../../domain/entities/turno.entity';
import {
  ITurnoRepository,
  PaginationParams,
  TurnoListFilters,
} from '../../../domain/interfaces/turno.repository.interface';
import { PaginatedResult } from '../../../../../../../common/interfaces/paginated-result.interface';
import { TurnoPersistenceMapper } from '../mappers/turno.persistence-mapper';
import { TurnoModel } from '../models/turno.model';

@Injectable()
export class TurnoRepository implements ITurnoRepository {
  async create(props: TurnoCreateProps): Promise<Turno> {
    const model = await TurnoModel.create({
      nombre: props.nombre,
      descripcion: props.descripcion ?? null,
      conductorId: props.conductorId,
      vehiculoId: props.vehiculoId,
      isActive: true,
    });

    return TurnoPersistenceMapper.toDomain(model);
  }

  async findById(id: number): Promise<Turno | null> {
    const model = await TurnoModel.findByPk(id);
    return model ? TurnoPersistenceMapper.toDomain(model) : null;
  }

  async findAll(
    filters: TurnoListFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Turno>> {
    const where: WhereOptions = {};

    if (filters.conductorId !== undefined) {
      where.conductorId = filters.conductorId;
    }

    if (filters.vehiculoId !== undefined) {
      where.vehiculoId = filters.vehiculoId;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const page = pagination.page;
    const limit = pagination.limit;
    const offset = (page - 1) * limit;

    const { rows, count } = await TurnoModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    return {
      items: rows.map((row) => TurnoPersistenceMapper.toDomain(row)),
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async update(id: number, props: TurnoUpdateProps): Promise<Turno | null> {
    const model = await TurnoModel.findByPk(id);

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

    return TurnoPersistenceMapper.toDomain(model);
  }

  async softDelete(id: number): Promise<Turno | null> {
    const model = await TurnoModel.findByPk(id);

    if (!model) {
      return null;
    }

    model.isActive = false;
    await model.save();

    return TurnoPersistenceMapper.toDomain(model);
  }

  async hasActiveTurnoForConductor(conductorId: number): Promise<boolean> {
    const count = await TurnoModel.count({
      where: { conductorId, isActive: true },
    });

    return count > 0;
  }

  async hasActiveTurnoForVehiculo(vehiculoId: number): Promise<boolean> {
    const count = await TurnoModel.count({
      where: { vehiculoId, isActive: true },
    });

    return count > 0;
  }
}
