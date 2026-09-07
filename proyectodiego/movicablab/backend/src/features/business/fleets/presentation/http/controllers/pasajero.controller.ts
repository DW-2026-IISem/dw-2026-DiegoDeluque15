import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreatePasajeroDto } from '../../../application/dto/create-pasajero.dto.js';
import { UpdatePasajeroDto } from '../../../application/dto/update-pasajero.dto.js';
import { ActualizarPasajeroUseCase } from '../../../application/use-cases/actualizar-pasajero.use-case.js';
import { CrearPasajeroUseCase } from '../../../application/use-cases/crear-pasajero.use-case.js';
import { EliminarPasajeroUseCase } from '../../../application/use-cases/eliminar-pasajero.use-case.js';
import { ListarPasajerosUseCase } from '../../../application/use-cases/listar-pasajeros.use-case.js';
import { ObtenerPasajeroUseCase } from '../../../application/use-cases/obtener-pasajero.use-case.js';

/**
 * Controlador HTTP de Pasajero.
 * Solo recibe la petición, la pasa al caso de uso correspondiente,
 * y devuelve el resultado. NO contiene lógica de negocio aquí.
 */
@ApiTags('Pasajeros')
@Controller('pasajeros')
export class PasajeroController {
  constructor(
    private readonly crearPasajero: CrearPasajeroUseCase,
    private readonly listarPasajeros: ListarPasajerosUseCase,
    private readonly obtenerPasajero: ObtenerPasajeroUseCase,
    private readonly actualizarPasajero: ActualizarPasajeroUseCase,
    private readonly eliminarPasajero: EliminarPasajeroUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pasajero' })
  crear(@Body() dto: CreatePasajeroDto) {
    return this.crearPasajero.ejecutar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pasajeros (por defecto solo activos)' })
  listar(@Query('soloActivos') soloActivos?: string) {
    // Query params llegan como string; "false" explícito desactiva el filtro.
    const filtro = soloActivos !== 'false';
    return this.listarPasajeros.ejecutar(filtro);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pasajero por id' })
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.obtenerPasajero.ejecutar(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar nombre/descripcion de un pasajero' })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePasajeroDto,
  ) {
    return this.actualizarPasajero.ejecutar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar (soft delete) un pasajero' })
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.eliminarPasajero.ejecutar(id);
  }
}
