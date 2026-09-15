import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IPagoRepository, IPAGO_REPOSITORY } from '../../domain/interfaces/pago-repository.interface';
import { Pago } from '../../domain/entities/pago.entity';
import { CreatePagoDto } from '../dto/create-pago.dto';
import { CarreraNoCerradaException } from '../../domain/exceptions/pago.exceptions';
import { ICarreraRepository } from '../../../../trips/domain/interfaces/carrera.repository.interface';
import { CARRERA_REPOSITORY } from '../../../../trips/domain/interfaces/carrera.repository.interface';

@Injectable()
export class CrearPago {
  constructor(
    @Inject(IPAGO_REPOSITORY)
    private readonly pagoRepository: IPagoRepository,
    @Inject(CARRERA_REPOSITORY)
    private readonly carreraRepository: ICarreraRepository,
  ) {}

  async execute(dto: CreatePagoDto) {
    const carrera = await this.carreraRepository.findById(dto.referenciaId);
    if (!carrera) {
      throw new HttpException(`La carrera con ID ${dto.referenciaId} no existe`, HttpStatus.NOT_FOUND);
    }

    if (carrera.estado !== 'cerrada') {
      throw new CarreraNoCerradaException(dto.referenciaId);
    }

    const pagoProps = Pago.create({
      referenciaTipo: 'carrera',
      referenciaId: dto.referenciaId,
      metodo: dto.metodo,
      monto: carrera.total ?? 0,
    });

    return await this.pagoRepository.save(pagoProps);
  }
}
