import { Controller, Post, Body, Get, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { CrearPago } from '../../../application/use-cases/crear-pago.use-case';
import { CreatePagoDto } from '../../../application/dto/create-pago.dto';
import { UpdatePagoEstadoDto } from '../../../application/dto/update-pago.dto';
import { Inject } from '@nestjs/common';
import { IPagoRepository, IPAGO_REPOSITORY } from '../../../domain/interfaces/pago-repository.interface';
import { PagoNotFoundException } from '../../../domain/exceptions/pago.exceptions';

@Controller('pagos')
export class PagosController {
  constructor(
    private readonly crearPagoUseCase: CrearPago,
    @Inject(IPAGO_REPOSITORY)
    private readonly pagoRepository: IPagoRepository,
  ) {}

  @Post()
  async create(@Body() createPagoDto: CreatePagoDto) {
    const result = await this.crearPagoUseCase.execute(createPagoDto);
    return result;
  }

  @Get()
  async findAll() {
    const result = await this.pagoRepository.findAll();
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.pagoRepository.findById(id);
    if (!result) throw new PagoNotFoundException(id);
    return result;
  }

  @Patch(':id/estado')
  async updateEstado(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdatePagoEstadoDto) {
    const result = await this.pagoRepository.updateEstado(id, updateDto.estado);
    if (!result) throw new PagoNotFoundException(id);
    return result;
  }
}
