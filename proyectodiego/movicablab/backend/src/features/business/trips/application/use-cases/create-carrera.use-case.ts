import { Inject, Injectable } from '@nestjs/common';
import { Carrera } from '../../domain/entities/carrera.entity';
import { ICarreraRepository, CARRERA_REPOSITORY } from '../../domain/interfaces/carrera.repository.interface';
import { CreateCarreraDto } from '../dto/create-carrera.dto';
import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';
import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception';

import { IPasajeroRepository, PASAJERO_REPOSITORY } from '../../../passengers/domain/interfaces/pasajero.repository.interface';
import { ITurnoRepository, TURNO_REPOSITORY } from '../../../drivers/turnos/domain/interfaces/turno.repository.interface';
import { ITarifaRepository, TARIFA_REPOSITORY } from '../../../pricing/domain/interfaces/tarifa.repository.interface';

@Injectable()
export class CreateCarreraUseCase {
  constructor(
    @Inject(CARRERA_REPOSITORY)
    private readonly carreraRepository: ICarreraRepository,
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
    @Inject(TURNO_REPOSITORY)
    private readonly turnoRepository: ITurnoRepository,
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
  ) {}

  async execute(dto: CreateCarreraDto): Promise<Carrera> {
    // Valida Pasajero
    const pasajero = await this.pasajeroRepository.findById(dto.pasajeroId);
    if (!pasajero || !pasajero.isActive) {
      throw new EntityNotFoundException(`Pasajero con id ${dto.pasajeroId} no encontrado o inactivo`);
    }

    // Valida Turno (debe existir y estar activo)
    const turno = await this.turnoRepository.findById(dto.turnoId);
    if (!turno || !turno.isActive) {
      throw new EntityNotFoundException(`Turno con id ${dto.turnoId} no encontrado o inactivo`);
    }

    // Obtiene Tarifa vigente
    const tarifa = await this.tarifaRepository.findVigente(new Date());
    if (!tarifa) {
      throw new BusinessRuleException('No hay ninguna tarifa vigente para el día de hoy');
    }

    const props = Carrera.create({
      pasajeroId: dto.pasajeroId,
      turnoId: dto.turnoId,
      tarifaId: tarifa.id,
      fechaInicio: new Date(),
      observaciones: dto.observaciones,
    });

    return this.carreraRepository.create(props);
  }
}
