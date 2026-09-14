import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CambiarEstadoCarreraUseCase } from '../../../application/use-cases/cambiar-estado-carrera.use-case';
import { CarreraMapper } from '../../../application/mappers/carrera.mapper';

@ApiTags('despachos')
@Controller('despachos')
export class DespachosController {
  constructor(
    private readonly cambiarEstadoCarreraUseCase: CambiarEstadoCarreraUseCase,
  ) {}

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Despachar carrera (cambiar a aceptada)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Carrera aceptada' })
  async despachar(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    // Alias para pasar de 'solicitada' a 'aceptada'
    const carrera = await this.cambiarEstadoCarreraUseCase.execute(id, 'aceptada');
    return CarreraMapper.toResponse(carrera);
  }
}
