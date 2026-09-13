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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTurnoUseCase } from '../../../application/use-cases/create-turno.use-case';
import { DeleteTurnoUseCase } from '../../../application/use-cases/delete-turno.use-case';
import { GetTurnoByIdUseCase } from '../../../application/use-cases/get-turno-by-id.use-case';
import { ListTurnosUseCase } from '../../../application/use-cases/list-turnos.use-case';
import { UpdateTurnoUseCase } from '../../../application/use-cases/update-turno.use-case';
import { CreateTurnoDto } from '../../../application/dto/create-turno.dto';
import { ListTurnosQueryDto } from '../../../application/dto/list-turnos-query.dto';
import { UpdateTurnoDto } from '../../../application/dto/update-turno.dto';
import { TurnoMapper } from '../../../application/mappers/turno.mapper';

@ApiTags('turnos')
@Controller('turnos')
export class TurnosController {
  constructor(
    private readonly createTurnoUseCase: CreateTurnoUseCase,
    private readonly listTurnosUseCase: ListTurnosUseCase,
    private readonly getTurnoByIdUseCase: GetTurnoByIdUseCase,
    private readonly updateTurnoUseCase: UpdateTurnoUseCase,
    private readonly deleteTurnoUseCase: DeleteTurnoUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear turno (conductorId y vehiculoId obligatorios)' })
  @ApiCreatedResponse({ description: 'Turno creado' })
  async create(@Body() dto: CreateTurnoDto): Promise<Record<string, unknown>> {
    const turno = await this.createTurnoUseCase.execute(dto);
    return TurnoMapper.toResponse(turno);
  }

  @Get()
  @ApiOperation({ summary: 'Listar turnos (paginado, filtros conductorId, vehiculoId, isActive)' })
  @ApiOkResponse({ description: 'Listado paginado de turnos' })
  async list(@Query() query: ListTurnosQueryDto): Promise<{
    items: Record<string, unknown>[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.listTurnosUseCase.execute(query);

    return {
      items: result.items.map((item) => TurnoMapper.toResponse(item)),
      meta: result.meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener turno por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Turno encontrado' })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    const turno = await this.getTurnoByIdUseCase.execute(id);
    return TurnoMapper.toResponse(turno);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar turno (solo nombre y descripción)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Turno actualizado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTurnoDto,
  ): Promise<Record<string, unknown>> {
    const turno = await this.updateTurnoUseCase.execute(id, dto);
    return TurnoMapper.toResponse(turno);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar turno (soft delete: is_active = false)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Turno desactivado' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    const turno = await this.deleteTurnoUseCase.execute(id);
    return TurnoMapper.toResponse(turno);
  }
}
