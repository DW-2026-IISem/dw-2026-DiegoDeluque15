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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateResourceRoleDto } from '../../../application/dto/create-resource-roles.dto';
import { UpdateResourceRoleDto } from '../../../application/dto/update-resource-roles.dto';
import { CreateResourceRoleUseCase } from '../../../application/use-cases/create-resource-roles.use-case';
import { ListResourceRolesUseCase } from '../../../application/use-cases/list-resourceroles.use-case';
import { GetResourceRoleByIdUseCase } from '../../../application/use-cases/get-resource-roles-by-id.use-case';
import { UpdateResourceRoleUseCase } from '../../../application/use-cases/update-resource-roles.use-case';
import { DeleteResourceRoleUseCase } from '../../../application/use-cases/delete-resource-roles.use-case';

@ApiTags('resource-roles')
@Controller('resource-roles')
export class ResourceRolesController {
  constructor(
    private readonly createUseCase: CreateResourceRoleUseCase,
    private readonly listUseCase: ListResourceRolesUseCase,
    private readonly getByIdUseCase: GetResourceRoleByIdUseCase,
    private readonly updateUseCase: UpdateResourceRoleUseCase,
    private readonly deleteUseCase: DeleteResourceRoleUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateResourceRoleDto) {
    return this.createUseCase.execute(createDto);
  }

  @Get()
  async findAll() {
    return this.listUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getByIdUseCase.execute(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateResourceRoleDto) {
    return this.updateUseCase.execute(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteUseCase.execute(id);
  }
}
