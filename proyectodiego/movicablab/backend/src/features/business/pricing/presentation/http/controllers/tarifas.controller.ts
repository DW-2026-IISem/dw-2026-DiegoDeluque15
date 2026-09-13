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
import { CreateTarifaUseCase } from '../../../application/use-cases/create-tarifa.use-case';
import { DeleteTarifaUseCase } from '../../../application/use-cases/delete-tarifa.use-case';
import { GetTarifaByIdUseCase } from '../../../application/use-cases/get-tarifa-by-id.use-case';
import { GetTarifaVigenteUseCase } from '../../../application/use-cases/get-tarifa-vigente.use-case';
import { ListTarifasUseCase } from '../../../application/use-cases/list-tarifas.use-case';
import { UpdateTarifaUseCase } from '../../../application/use-cases/update-tarifa.use-case';
import { CreateTarifaDto } from '../../../application/dto/create-tarifa.dto';
import { ListTarifasQueryDto } from '../../../application/dto/list-tarifas-query.dto';
import { UpdateTarifaDto } from '../../../application/dto/update-tarifa.dto';
import { TarifaMapper } from '../../../application/mappers/tarifa.mapper';

@ApiTags('tarifas')
@Controller('tarifas')
export class TarifasController {
  constructor(
    private readonly createTarifaUseCase: CreateTarifaUseCase,
    private readonly listTarifasUseCase: ListTarifasUseCase,
    private readonly getTarifaVigenteUseCase: GetTarifaVigenteUseCase,
    private readonly getTarifaByIdUseCase: GetTarifaByIdUseCase,
    private readonly updateTarifaUseCase: UpdateTarifaUseCase,
    private readonly deleteTarifaUseCase: DeleteTarifaUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear tarifa (valida solape)' })
  @ApiCreatedResponse({ description: 'Tarifa creada' })
  async create(@Body() dto: CreateTarifaDto): Promise<Record<string, unknown>> {
    const tarifa = await this.createTarifaUseCase.execute(dto);
    return TarifaMapper.toResponse(tarifa);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tarifas (paginado)' })
  @ApiOkResponse({ description: 'Listado paginado de tarifas' })
  async list(@Query() query: ListTarifasQueryDto): Promise<{
    items: Record<string, unknown>[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.listTarifasUseCase.execute(query);
    return {
      items: result.items.map((item) => TarifaMapper.toResponse(item)),
      meta: result.meta,
    };
  }

  // ¡Debe ir antes que el :id para que no choque la ruta!
  @Get('vigente')
  @ApiOperation({ summary: 'Obtener tarifa activa y vigente hoy' })
  @ApiOkResponse({ description: 'Tarifa vigente encontrada' })
  async getVigente(): Promise<Record<string, unknown>> {
    const tarifa = await this.getTarifaVigenteUseCase.execute();
    return TarifaMapper.toResponse(tarifa);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tarifa por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Tarifa encontrada' })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    const tarifa = await this.getTarifaByIdUseCase.execute(id);
    return TarifaMapper.toResponse(tarifa);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tarifa (solo si no ha iniciado)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Tarifa actualizada' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTarifaDto,
  ): Promise<Record<string, unknown>> {
    const tarifa = await this.updateTarifaUseCase.execute(id, dto);
    return TarifaMapper.toResponse(tarifa);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar tarifa (soft delete)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Tarifa desactivada' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    const tarifa = await this.deleteTarifaUseCase.execute(id);
    return TarifaMapper.toResponse(tarifa);
  }
}
