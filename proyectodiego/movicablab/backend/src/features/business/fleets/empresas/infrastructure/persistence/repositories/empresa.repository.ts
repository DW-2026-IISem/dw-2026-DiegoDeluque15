import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import {
  Empresa,
  EmpresaCreateProps,
  EmpresaUpdateProps,
} from '../../../domain/entities/empresa.entity';
import {
  IEmpresaRepository,
  EmpresaListFilters,
  PaginationParams,
} from '../../../domain/interfaces/empresa.repository.interface';
import { PaginatedResult } from '../../../../../../../common/interfaces/paginated-result.interface';
import { EmpresaPersistenceMapper } from '../mappers/empresa.persistence-mapper';
import { EmpresaModel } from '../models/empresa.model';

@Injectable()
export class EmpresaRepository implements IEmpresaRepository {
  async create(props: EmpresaCreateProps): Promise<Empresa> {
    const model = await EmpresaModel.create({
      nit: props.nit,
      razonSocial: props.razonSocial,
      contactoPrincipal: props.contactoPrincipal ?? null,
      isActive: true,
    });

    return EmpresaPersistenceMapper.toDomain(model);
  }

  async findById(id: number): Promise<Empresa | null> {
    const model = await EmpresaModel.findByPk(id);
    return model ? EmpresaPersistenceMapper.toDomain(model) : null;
  }

  async findByNit(nit: string): Promise<Empresa | null> {
    const model = await EmpresaModel.findOne({ where: { nit } });
    return model ? EmpresaPersistenceMapper.toDomain(model) : null;
  }

  async findAll(
    filters: EmpresaListFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Empresa>> {
    const where: WhereOptions = {};

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const page = pagination.page;
    const limit = pagination.limit;
    const offset = (page - 1) * limit;

    const { rows, count } = await EmpresaModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    return {
      items: rows.map((row) => EmpresaPersistenceMapper.toDomain(row)),
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async update(id: number, props: EmpresaUpdateProps): Promise<Empresa | null> {
    const model = await EmpresaModel.findByPk(id);

    if (!model) {
      return null;
    }

    if (props.razonSocial !== undefined) {
      model.razonSocial = props.razonSocial;
    }

    if (props.contactoPrincipal !== undefined) {
      model.contactoPrincipal = props.contactoPrincipal;
    }

    await model.save();

    return EmpresaPersistenceMapper.toDomain(model);
  }

  async softDelete(id: number): Promise<Empresa | null> {
    const model = await EmpresaModel.findByPk(id);

    if (!model) {
      return null;
    }

    model.isActive = false;
    await model.save();

    return EmpresaPersistenceMapper.toDomain(model);
  }
}
