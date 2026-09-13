import { Inject, Injectable } from '@nestjs/common';
import {
  CONDUCTOR_REPOSITORY,
  IConductorRepository,
} from '../../../conductores/domain/interfaces/conductor.repository.interface';
import {
  IVehiculoRepository,
  VEHICULO_REPOSITORY,
} from '../../../../fleets/vehiculos/domain/interfaces/vehiculo.repository.interface';
import { Turno } from '../../domain/entities/turno.entity';
import { ConductorInactiveException } from '../../domain/exceptions/conductor-inactive.exception';
import { VehiculoInactiveException } from '../../domain/exceptions/vehiculo-inactive.exception';
import { TurnoSolapadoException } from '../../domain/exceptions/turno-solapado.exception';
import {
  ITurnoRepository,
  TURNO_REPOSITORY,
} from '../../domain/interfaces/turno.repository.interface';
import { CreateTurnoDto } from '../dto/create-turno.dto';

@Injectable()
export class CreateTurnoUseCase {
  constructor(
    @Inject(TURNO_REPOSITORY)
    private readonly turnoRepository: ITurnoRepository,
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
    @Inject(VEHICULO_REPOSITORY)
    private readonly vehiculoRepository: IVehiculoRepository,
  ) {}

  async execute(dto: CreateTurnoDto): Promise<Turno> {
    // Validar que el conductor exista y esté activo
    const conductor = await this.conductorRepository.findById(dto.conductorId);
    if (!conductor || !conductor.isActive) {
      throw new ConductorInactiveException(dto.conductorId);
    }

    // Validar que el vehículo exista y esté activo
    const vehiculo = await this.vehiculoRepository.findById(dto.vehiculoId);
    if (!vehiculo || !vehiculo.isActive) {
      throw new VehiculoInactiveException(dto.vehiculoId);
    }

    // Validar solape: mismo conductorId con turno activo
    const conductorOcupado = await this.turnoRepository.hasActiveTurnoForConductor(dto.conductorId);
    if (conductorOcupado) {
      throw new TurnoSolapadoException('conductor', dto.conductorId);
    }

    // Validar solape: mismo vehiculoId con turno activo
    const vehiculoOcupado = await this.turnoRepository.hasActiveTurnoForVehiculo(dto.vehiculoId);
    if (vehiculoOcupado) {
      throw new TurnoSolapadoException('vehiculo', dto.vehiculoId);
    }

    const props = Turno.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
      conductorId: dto.conductorId,
      vehiculoId: dto.vehiculoId,
    });

    return this.turnoRepository.create(props);
  }
}
