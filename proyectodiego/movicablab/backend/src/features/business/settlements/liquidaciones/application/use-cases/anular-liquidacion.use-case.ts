import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.constants';
import { ILIQUIDACION_REPOSITORY, ILiquidacionRepository } from '../../domain/interfaces/liquidacion-repository.interface';
import { LiquidacionNotFoundException } from '../../domain/exceptions/liquidacion-not-found.exception';
import { ConflictException } from '@nestjs/common';
import { CarreraModel } from '../../../../trips/infrastructure/persistence/models/carrera.model';

@Injectable()
export class AnularLiquidacion {
  constructor(
    @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
    @Inject(ILIQUIDACION_REPOSITORY) private readonly liquidacionRepo: ILiquidacionRepository,
  ) {}

  async execute(id: number) {
    return this.sequelize.transaction(async (t) => {
      const liquidacion = await this.liquidacionRepo.findById(id);
      if (!liquidacion) throw new LiquidacionNotFoundException(id);
      if (liquidacion.estado === 'anulada') {
        throw new ConflictException(`La liquidacion ${id} ya está anulada`);
      }

      await this.liquidacionRepo.updateEstado(id, 'anulada', t);

      await CarreraModel.update(
        { liquidacionId: null },
        { where: { liquidacionId: id }, transaction: t },
      );

      return { ...liquidacion, estado: 'anulada' };
    });
  }
}
