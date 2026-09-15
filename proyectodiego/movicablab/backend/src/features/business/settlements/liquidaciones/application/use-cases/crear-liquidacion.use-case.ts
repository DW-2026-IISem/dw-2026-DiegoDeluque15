import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.constants';
import { CreateLiquidacionDto } from '../dto/create-liquidacion.dto';
import { ILIQUIDACION_REPOSITORY, ILiquidacionRepository } from '../../domain/interfaces/liquidacion-repository.interface';
import { SinCarrerasParaLiquidarException } from '../../domain/exceptions/sin-carreras-para-liquidar.exception';
import { CarreraModel } from '../../../../trips/infrastructure/persistence/models/carrera.model';
import { TurnoModel } from '../../../../drivers/turnos/infrastructure/persistence/models/turno.model';

@Injectable()
export class CrearLiquidacion {
  constructor(
    @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
    @Inject(ILIQUIDACION_REPOSITORY) private readonly liquidacionRepo: ILiquidacionRepository,
  ) {}

  async execute(dto: CreateLiquidacionDto) {
    return this.sequelize.transaction(async (t) => {
      // 1. Resolve turnos del conductor
      const turnos = await TurnoModel.findAll({
        where: { conductorId: dto.conductorId },
        transaction: t,
      });

      if (turnos.length === 0) {
        throw new SinCarrerasParaLiquidarException();
      }

      const turnoIds = turnos.map((turno) => turno.id);

      // 2. Buscar carreras elegibles
      const carreras = await CarreraModel.findAll({
        where: {
          estado: 'cerrada',
          liquidacionId: null,
          turnoId: { [Op.in]: turnoIds },
          fechaInicio: {
            [Op.between]: [new Date(dto.fechaDesde), new Date(dto.fechaHasta)],
          },
        },
        transaction: t,
      });

      if (carreras.length === 0) {
        throw new SinCarrerasParaLiquidarException();
      }

      // 3. Calcular valor
      const valor = carreras.reduce((sum, c) => sum + Number(c.total ?? 0), 0);

      // 4. Crear liquidacion
      const liquidacion = await this.liquidacionRepo.save(
        { fecha: new Date(), valor, estado: 'pendiente' },
        t,
      );

      // 5. Asignar liquidacionId a cada carrera
      const carreraIds = carreras.map((c) => c.id);
      await CarreraModel.update(
        { liquidacionId: liquidacion.id },
        { where: { id: carreraIds }, transaction: t },
      );

      return liquidacion;
    });
  }
}
