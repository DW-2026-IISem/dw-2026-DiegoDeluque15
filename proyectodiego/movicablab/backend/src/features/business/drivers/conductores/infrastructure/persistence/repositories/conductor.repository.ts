import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import {
  Conductor,
  ConductorCreateProps,
  ConductorUpdateProps,
} from '../../../domain/entities/conductor.entity';
import {
  IConductorRepository,
  PaginationParams,
  ConductorListFilters,
} from '../../../domain/interfaces/conductor.repository.interface';
import { PaginatedResult } from '../../../../../../../common/interfaces/paginated-result.interface';
import { ConductorPersistenceMapper } from '../mappers/conductor.persistence-mapper';
import { ConductorModel } from '../models/conductor.model';

@Injectable()
export class ConductorRepository implements IConductorRepository {
  async create(props: ConductorCreateProps): Promise<Conductor> {
    const model = await ConductorModel.create({
      nombre: props.nombre,
      descripcion: props.descripcion ?? null,
      empresaId: props.empresaId ?? null,
      isActive: true,
    });

    return ConductorPersistenceMapper.toDomain(model);
  }

  async findById(id: number): Promise<Conductor | null> {
    const model = await ConductorModel.findByPk(id);
    return model ? ConductorPersistenceMapper.toDomain(model) : null;
  }

  async findAll(
    filters: ConductorListFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Conductor>> {
    const where: WhereOptions = {};

    if (filters.empresaId !== undefined) {
      where.empresaId = filters.empresaId;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const page = pagination.page;
    const limit = pagination.limit;
    const offset = (page - 1) * limit;

    const { rows, count } = await ConductorModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    return {
      items: rows.map((row) => ConductorPersistenceMapper.toDomain(row)),
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async update(id: number, props: ConductorUpdateProps): Promise<Conductor | null> {
    const model = await ConductorModel.findByPk(id);

    if (!model) {
      return null;
    }

    if (props.nombre !== undefined) {
      model.nombre = props.nombre;
    }

    if (props.descripcion !== undefined) {
      model.descripcion = props.descripcion;
    }

    if (props.empresaId !== undefined) {
      model.empresaId = props.empresaId;
    }

    await model.save();

    return ConductorPersistenceMapper.toDomain(model);
  }

  async softDelete(id: number): Promise<Conductor | null> {
    const model = await ConductorModel.findByPk(id);

    if (!model) {
      return null;
    }

    model.isActive = false;
    await model.save();

    return ConductorPersistenceMapper.toDomain(model);
  }

  async countActiveByEmpresaId(empresaId: number): Promise<number> {
    return ConductorModel.count({
      where: { empresaId, isActive: true },
    });
  }
}
