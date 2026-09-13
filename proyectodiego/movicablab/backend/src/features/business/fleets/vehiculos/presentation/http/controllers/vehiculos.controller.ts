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
import { CreateVehiculoUseCase } from '../../../application/use-cases/create-vehiculo.use-case';
import { DeleteVehiculoUseCase } from '../../../application/use-cases/delete-vehiculo.use-case';
import { GetVehiculoByIdUseCase } from '../../../application/use-cases/get-vehiculo-by-id.use-case';
import { ListVehiculosUseCase } from '../../../application/use-cases/list-vehiculos.use-case';
import { UpdateVehiculoUseCase } from '../../../application/use-cases/update-vehiculo.use-case';
import { CreateVehiculoDto } from '../../../application/dto/create-vehiculo.dto';
import { ListVehiculosQueryDto } from '../../../application/dto/list-vehiculos-query.dto';
import { UpdateVehiculoDto } from '../../../application/dto/update-vehiculo.dto';
import { VehiculoMapper } from '../../../application/mappers/vehiculo.mapper';

@ApiTags('vehiculos')
@Controller('vehiculos')
export class VehiculosController {
  constructor(
    private readonly createVehiculoUseCase: CreateVehiculoUseCase,
    private readonly listVehiculosUseCase: ListVehiculosUseCase,
    private readonly getVehiculoByIdUseCase: GetVehiculoByIdUseCase,
    private readonly updateVehiculoUseCase: UpdateVehiculoUseCase,
    private readonly deleteVehiculoUseCase: DeleteVehiculoUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear vehículo (empresaId obligatorio)' })
  @ApiCreatedResponse({ description: 'Vehículo creado' })
  async create(@Body() dto: CreateVehiculoDto): Promise<Record<string, unknown>> {
    const vehiculo = await this.createVehiculoUseCase.execute(dto);
    return VehiculoMapper.toResponse(vehiculo);
  }

  @Get()
  @ApiOperation({ summary: 'Listar vehículos (paginado, filtros empresaId e isActive)' })
  @ApiOkResponse({ description: 'Listado paginado de vehículos' })
  async list(@Query() query: ListVehiculosQueryDto): Promise<{
    items: Record<string, unknown>[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.listVehiculosUseCase.execute(query);

    return {
      items: result.items.map((item) => VehiculoMapper.toResponse(item)),
      meta: result.meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener vehículo por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Vehículo encontrado' })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    const vehiculo = await this.getVehiculoByIdUseCase.execute(id);
    return VehiculoMapper.toResponse(vehiculo);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar vehículo' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Vehículo actualizado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehiculoDto,
  ): Promise<Record<string, unknown>> {
    const vehiculo = await this.updateVehiculoUseCase.execute(id, dto);
    return VehiculoMapper.toResponse(vehiculo);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar vehículo (soft delete: is_active = false)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Vehículo desactivado' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    const vehiculo = await this.deleteVehiculoUseCase.execute(id);
    return VehiculoMapper.toResponse(vehiculo);
  }
}
