import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import {
  Vehiculo,
  VehiculoCreateProps,
  VehiculoUpdateProps,
} from '../../../domain/entities/vehiculo.entity';
import {
  IVehiculoRepository,
  PaginationParams,
  VehiculoListFilters,
} from '../../../domain/interfaces/vehiculo.repository.interface';
import { PaginatedResult } from '../../../../../../../common/interfaces/paginated-result.interface';
import { VehiculoPersistenceMapper } from '../mappers/vehiculo.persistence-mapper';
import { VehiculoModel } from '../models/vehiculo.model';

@Injectable()
export class VehiculoRepository implements IVehiculoRepository {
  async create(props: VehiculoCreateProps): Promise<Vehiculo> {
    const model = await VehiculoModel.create({
      nombre: props.nombre,
      descripcion: props.descripcion ?? null,
      empresaId: props.empresaId,
      isActive: true,
    });

    return VehiculoPersistenceMapper.toDomain(model);
  }

  async findById(id: number): Promise<Vehiculo | null> {
    const model = await VehiculoModel.findByPk(id);
    return model ? VehiculoPersistenceMapper.toDomain(model) : null;
  }

  async findAll(
    filters: VehiculoListFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Vehiculo>> {
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

    const { rows, count } = await VehiculoModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    return {
      items: rows.map((row) => VehiculoPersistenceMapper.toDomain(row)),
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async update(id: number, props: VehiculoUpdateProps): Promise<Vehiculo | null> {
    const model = await VehiculoModel.findByPk(id);

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

    return VehiculoPersistenceMapper.toDomain(model);
  }

  async softDelete(id: number): Promise<Vehiculo | null> {
    const model = await VehiculoModel.findByPk(id);

    if (!model) {
      return null;
    }

    model.isActive = false;
    await model.save();

    return VehiculoPersistenceMapper.toDomain(model);
  }

  async countActiveByEmpresaId(empresaId: number): Promise<number> {
    return VehiculoModel.count({
      where: { empresaId, isActive: true },
    });
  }
}
