import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CrearLiquidacion } from '../../../application/use-cases/crear-liquidacion.use-case';
import { AnularLiquidacion } from '../../../application/use-cases/anular-liquidacion.use-case';
import { ListLiquidaciones } from '../../../application/use-cases/list-liquidaciones.use-case';
import { GetLiquidacionById } from '../../../application/use-cases/get-liquidacion-by-id.use-case';
import { UpdateLiquidacionEstado } from '../../../application/use-cases/update-liquidacion-estado.use-case';
import { CreateLiquidacionDto } from '../../../application/dto/create-liquidacion.dto';
import { UpdateLiquidacionEstadoDto } from '../../../application/dto/update-liquidacion-estado.dto';

@ApiTags('liquidaciones')
@Controller('liquidaciones')
export class LiquidacionesController {
  constructor(
    private readonly crearLiquidacion: CrearLiquidacion,
    private readonly anularLiquidacion: AnularLiquidacion,
    private readonly listLiquidaciones: ListLiquidaciones,
    private readonly getLiquidacionById: GetLiquidacionById,
    private readonly updateEstado: UpdateLiquidacionEstado,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear liquidación agrupando carreras cerradas del conductor' })
  async create(@Body() dto: CreateLiquidacionDto) {
    return this.crearLiquidacion.execute(dto);
  }

  @Get()
  async findAll(
    @Query('estado') estado?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ) {
    return this.listLiquidaciones.execute({ estado, fechaDesde, fechaHasta });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getLiquidacionById.execute(id);
  }

  @Patch(':id/estado')
  async updateEstadoHandler(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLiquidacionEstadoDto,
  ) {
    return this.updateEstado.execute(id, dto.estado);
  }

  @Post(':id/anular')
  async anular(@Param('id', ParseIntPipe) id: number) {
    return this.anularLiquidacion.execute(id);
  }
}
