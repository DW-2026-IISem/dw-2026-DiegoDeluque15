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
import { CreatePasajeroUseCase } from '../../../application/use-cases/create-pasajero.use-case';
import { DeletePasajeroUseCase } from '../../../application/use-cases/delete-pasajero.use-case';
import { GetPasajeroByIdUseCase } from '../../../application/use-cases/get-pasajero-by-id.use-case';
import { ListPasajerosUseCase } from '../../../application/use-cases/list-pasajeros.use-case';
import { UpdatePasajeroUseCase } from '../../../application/use-cases/update-pasajero.use-case';
import { CreatePasajeroDto } from '../../../application/dto/create-pasajero.dto';
import { ListPasajerosQueryDto } from '../../../application/dto/list-pasajeros-query.dto';
import { UpdatePasajeroDto } from '../../../application/dto/update-pasajero.dto';
import { PasajeroMapper } from '../../../application/mappers/pasajero.mapper';

@ApiTags('pasajeros')
@Controller('pasajeros')
export class PasajerosController {
  constructor(
    private readonly createPasajeroUseCase: CreatePasajeroUseCase,
    private readonly listPasajerosUseCase: ListPasajerosUseCase,
    private readonly getPasajeroByIdUseCase: GetPasajeroByIdUseCase,
    private readonly updatePasajeroUseCase: UpdatePasajeroUseCase,
    private readonly deletePasajeroUseCase: DeletePasajeroUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear pasajero' })
  @ApiCreatedResponse({ description: 'Pasajero creado' })
  async create(@Body() dto: CreatePasajeroDto): Promise<Record<string, unknown>> {
    const pasajero = await this.createPasajeroUseCase.execute(dto);
    return PasajeroMapper.toResponse(pasajero);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pasajeros (paginado, filtro isActive)' })
  @ApiOkResponse({ description: 'Listado paginado de pasajeros' })
  async list(@Query() query: ListPasajerosQueryDto): Promise<{
    items: Record<string, unknown>[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.listPasajerosUseCase.execute(query);

    return {
      items: result.items.map((item) => PasajeroMapper.toResponse(item)),
      meta: result.meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pasajero por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Pasajero encontrado' })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    const pasajero = await this.getPasajeroByIdUseCase.execute(id);
    return PasajeroMapper.toResponse(pasajero);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar pasajero' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Pasajero actualizado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePasajeroDto,
  ): Promise<Record<string, unknown>> {
    const pasajero = await this.updatePasajeroUseCase.execute(id, dto);
    return PasajeroMapper.toResponse(pasajero);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar pasajero (soft delete: is_active = false)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Pasajero desactivado' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    const pasajero = await this.deletePasajeroUseCase.execute(id);
    return PasajeroMapper.toResponse(pasajero);
  }
}
