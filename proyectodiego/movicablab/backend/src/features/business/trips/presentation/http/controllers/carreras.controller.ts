import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateCarreraUseCase } from '../../../application/use-cases/create-carrera.use-case';
import { CambiarEstadoCarreraUseCase } from '../../../application/use-cases/cambiar-estado-carrera.use-case';
import { ListCarrerasUseCase } from '../../../application/use-cases/list-carreras.use-case';
import { GetCarreraByIdUseCase } from '../../../application/use-cases/get-carrera-by-id.use-case';
import { CreateCarreraDto } from '../../../application/dto/create-carrera.dto';
import { ChangeEstadoCarreraDto } from '../../../application/dto/change-estado-carrera.dto';
import { ListCarrerasQueryDto } from '../../../application/dto/list-carreras-query.dto';
import { CarreraMapper } from '../../../application/mappers/carrera.mapper';
import { BusinessRuleException } from '../../../../../../common/exceptions/business-rule.exception';

@ApiTags('carreras')
@Controller('carreras')
export class CarrerasController {
  constructor(
    private readonly createCarreraUseCase: CreateCarreraUseCase,
    private readonly listCarrerasUseCase: ListCarrerasUseCase,
    private readonly getCarreraByIdUseCase: GetCarreraByIdUseCase,
    private readonly cambiarEstadoCarreraUseCase: CambiarEstadoCarreraUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear carrera (solicitada)' })
  @ApiCreatedResponse({ description: 'Carrera creada' })
  async create(@Body() dto: CreateCarreraDto): Promise<Record<string, unknown>> {
    const carrera = await this.createCarreraUseCase.execute(dto);
    return CarreraMapper.toResponse(carrera);
  }

  @Get()
  @ApiOperation({ summary: 'Listar carreras (paginado y filtros)' })
  @ApiOkResponse({ description: 'Listado paginado de carreras' })
  async list(@Query() query: ListCarrerasQueryDto): Promise<{
    items: Record<string, unknown>[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.listCarrerasUseCase.execute(query);
    return {
      items: result.items.map((item) => CarreraMapper.toResponse(item)),
      meta: result.meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener carrera por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Carrera encontrada' })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    const carrera = await this.getCarreraByIdUseCase.execute(id);
    return CarreraMapper.toResponse(carrera);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Cambiar estado de carrera' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Estado actualizado' })
  async updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeEstadoCarreraDto,
  ): Promise<Record<string, unknown>> {
    const carrera = await this.cambiarEstadoCarreraUseCase.execute(id, dto.estado);
    return CarreraMapper.toResponse(carrera);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar carrera (si no está cerrada)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Carrera cancelada' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    const carrera = await this.getCarreraByIdUseCase.execute(id);
    if (carrera.estado === 'cerrada') {
      throw new BusinessRuleException('No se puede cancelar una carrera que ya está cerrada');
    }
    const updated = await this.cambiarEstadoCarreraUseCase.execute(id, 'cancelada');
    return CarreraMapper.toResponse(updated);
  }
}
