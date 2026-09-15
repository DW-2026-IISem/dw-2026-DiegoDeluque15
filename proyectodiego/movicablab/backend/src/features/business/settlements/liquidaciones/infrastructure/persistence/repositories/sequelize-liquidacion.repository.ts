import { Injectable, Inject } from '@nestjs/common';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { LiquidacionModel } from '../models/liquidacion.model';
import { ILiquidacionRepository } from '../../../domain/interfaces/liquidacion-repository.interface';
import { LiquidacionProps } from '../../../domain/entities/liquidacion.entity';
import { CarreraModel } from '../../../../../trips/infrastructure/persistence/models/carrera.model';
import { SEQUELIZE } from '../../../../../../../infrastructure/database/sequelize/sequelize.constants';

@Injectable()
export class SequelizeLiquidacionRepository implements ILiquidacionRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  async save(data: Omit<LiquidacionProps, 'id'>, t?: Transaction): Promise<LiquidacionProps> {
    const created = await LiquidacionModel.create(data as any, { transaction: t });
    return created.toJSON() as LiquidacionProps;
  }

  async findById(id: number): Promise<LiquidacionProps | null> {
    const model = await LiquidacionModel.findByPk(id);
    return model ? (model.toJSON() as LiquidacionProps) : null;
  }

  async findAll(filters?: { estado?: string; fechaDesde?: Date; fechaHasta?: Date }): Promise<LiquidacionProps[]> {
    const where: any = {};
    if (filters?.estado) where.estado = filters.estado;
    if (filters?.fechaDesde || filters?.fechaHasta) {
      where.fecha = {};
      if (filters.fechaDesde) where.fecha[Op.gte] = filters.fechaDesde;
      if (filters.fechaHasta) where.fecha[Op.lte] = filters.fechaHasta;
    }
    const rows = await LiquidacionModel.findAll({ where, order: [['fecha', 'DESC']] });
    return rows.map((r) => r.toJSON() as LiquidacionProps);
  }

  async findByIdWithCarreras(id: number): Promise<(LiquidacionProps & { carreras?: any[] }) | null> {
    const model = await LiquidacionModel.findByPk(id, {
      include: [{ model: CarreraModel }],
    });
    if (!model) return null;
    return model.toJSON() as LiquidacionProps & { carreras?: any[] };
  }

  async updateEstado(id: number, estado: string, t?: Transaction): Promise<LiquidacionProps | null> {
    const [affectedCount] = await LiquidacionModel.update({ estado }, { where: { id }, transaction: t });
    if (affectedCount === 0) return null;
    return this.findById(id);
  }
}
