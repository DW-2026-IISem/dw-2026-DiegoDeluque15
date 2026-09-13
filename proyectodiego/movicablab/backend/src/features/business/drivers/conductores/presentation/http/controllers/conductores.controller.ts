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
import { CreateConductorUseCase } from '../../../application/use-cases/create-conductor.use-case';
import { DeleteConductorUseCase } from '../../../application/use-cases/delete-conductor.use-case';
import { GetConductorByIdUseCase } from '../../../application/use-cases/get-conductor-by-id.use-case';
import { ListConductoresUseCase } from '../../../application/use-cases/list-conductores.use-case';
import { UpdateConductorUseCase } from '../../../application/use-cases/update-conductor.use-case';
import { CreateConductorDto } from '../../../application/dto/create-conductor.dto';
import { ListConductoresQueryDto } from '../../../application/dto/list-conductores-query.dto';
import { UpdateConductorDto } from '../../../application/dto/update-conductor.dto';
import { ConductorMapper } from '../../../application/mappers/conductor.mapper';

@ApiTags('conductores')
@Controller('conductores')
export class ConductoresController {
  constructor(
    private readonly createConductorUseCase: CreateConductorUseCase,
    private readonly listConductoresUseCase: ListConductoresUseCase,
    private readonly getConductorByIdUseCase: GetConductorByIdUseCase,
    private readonly updateConductorUseCase: UpdateConductorUseCase,
    private readonly deleteConductorUseCase: DeleteConductorUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear conductor (empresaId opcional)' })
  @ApiCreatedResponse({ description: 'Conductor creado' })
  async create(@Body() dto: CreateConductorDto): Promise<Record<string, unknown>> {
    const conductor = await this.createConductorUseCase.execute(dto);
    return ConductorMapper.toResponse(conductor);
  }

  @Get()
  @ApiOperation({ summary: 'Listar conductores (paginado, filtros empresaId e isActive)' })
  @ApiOkResponse({ description: 'Listado paginado de conductores' })
  async list(@Query() query: ListConductoresQueryDto): Promise<{
    items: Record<string, unknown>[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.listConductoresUseCase.execute(query);

    return {
      items: result.items.map((item) => ConductorMapper.toResponse(item)),
      meta: result.meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener conductor por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Conductor encontrado' })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    const conductor = await this.getConductorByIdUseCase.execute(id);
    return ConductorMapper.toResponse(conductor);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar conductor' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Conductor actualizado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConductorDto,
  ): Promise<Record<string, unknown>> {
    const conductor = await this.updateConductorUseCase.execute(id, dto);
    return ConductorMapper.toResponse(conductor);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar conductor (soft delete: is_active = false)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Conductor desactivado' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    const conductor = await this.deleteConductorUseCase.execute(id);
    return ConductorMapper.toResponse(conductor);
  }
}
