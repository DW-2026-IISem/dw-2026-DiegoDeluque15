import { Controller, Post, Body, Get, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CrearCalificacion } from '../../../application/use-cases/crear-calificacion.use-case';
import { CreateCalificacionDto } from '../../../application/dto/create-calificacion.dto';
import { UpdateCalificacionDto } from '../../../application/dto/update-calificacion.dto';
import { Inject } from '@nestjs/common';
import { ICalificacionRepository, ICALIFICACION_REPOSITORY } from '../../../domain/interfaces/calificacion-repository.interface';
import { CalificacionNotFoundException } from '../../../domain/exceptions/calificacion.exceptions';

@ApiTags('calificaciones')
@Controller('calificaciones')
export class CalificacionesController {
  constructor(
    private readonly crearCalificacionUseCase: CrearCalificacion,
    @Inject(ICALIFICACION_REPOSITORY)
    private readonly calificacionRepository: ICalificacionRepository,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear calificación sobre carrera cerrada' })
  async create(@Body() createDto: CreateCalificacionDto) {
    const result = await this.crearCalificacionUseCase.execute(createDto);
    return result;
  }

  @Get()
  async findAll() {
    const result = await this.calificacionRepository.findAll();
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.calificacionRepository.findById(id);
    if (!result) throw new CalificacionNotFoundException(id);
    return result;
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCalificacionDto) {
    const result = await this.calificacionRepository.update(id, updateDto);
    if (!result) throw new CalificacionNotFoundException(id);
    return result;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const success = await this.calificacionRepository.delete(id);
    if (!success) throw new CalificacionNotFoundException(id);
    return null;
  }
}
