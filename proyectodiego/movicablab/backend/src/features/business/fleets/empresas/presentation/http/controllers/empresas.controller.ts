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
import { CreateEmpresaUseCase } from '../../../application/use-cases/create-empresa.use-case';
import { DeleteEmpresaUseCase } from '../../../application/use-cases/delete-empresa.use-case';
import { GetEmpresaByIdUseCase } from '../../../application/use-cases/get-empresa-by-id.use-case';
import { ListEmpresasUseCase } from '../../../application/use-cases/list-empresas.use-case';
import { UpdateEmpresaUseCase } from '../../../application/use-cases/update-empresa.use-case';
import { CreateEmpresaDto } from '../../../application/dto/create-empresa.dto';
import { ListEmpresasQueryDto } from '../../../application/dto/list-empresas-query.dto';
import { UpdateEmpresaDto } from '../../../application/dto/update-empresa.dto';
import { EmpresaMapper } from '../../../application/mappers/empresa.mapper';

@ApiTags('empresas')
@Controller('empresas')
export class EmpresasController {
  constructor(
    private readonly createEmpresaUseCase: CreateEmpresaUseCase,
    private readonly listEmpresasUseCase: ListEmpresasUseCase,
    private readonly getEmpresaByIdUseCase: GetEmpresaByIdUseCase,
    private readonly updateEmpresaUseCase: UpdateEmpresaUseCase,
    private readonly deleteEmpresaUseCase: DeleteEmpresaUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear empresa' })
  @ApiCreatedResponse({ description: 'Empresa creada' })
  async create(@Body() dto: CreateEmpresaDto): Promise<Record<string, unknown>> {
    const empresa = await this.createEmpresaUseCase.execute(dto);
    return EmpresaMapper.toResponse(empresa);
  }

  @Get()
  @ApiOperation({ summary: 'Listar empresas (paginado, filtro isActive)' })
  @ApiOkResponse({ description: 'Listado paginado de empresas' })
  async list(@Query() query: ListEmpresasQueryDto): Promise<{
    items: Record<string, unknown>[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.listEmpresasUseCase.execute(query);

    return {
      items: result.items.map((item) => EmpresaMapper.toResponse(item)),
      meta: result.meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener empresa por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Empresa encontrada' })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    const empresa = await this.getEmpresaByIdUseCase.execute(id);
    return EmpresaMapper.toResponse(empresa);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar empresa (NIT inmutable)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Empresa actualizada' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmpresaDto,
  ): Promise<Record<string, unknown>> {
    const empresa = await this.updateEmpresaUseCase.execute(id, dto);
    return EmpresaMapper.toResponse(empresa);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar empresa (soft delete: is_active = false)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Empresa desactivada' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Record<string, unknown>> {
    const empresa = await this.deleteEmpresaUseCase.execute(id);
    return EmpresaMapper.toResponse(empresa);
  }
}
