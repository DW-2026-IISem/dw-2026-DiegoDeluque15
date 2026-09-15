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
import { CreateRoleDto } from '../../../application/dto/create-roles.dto';
import { UpdateRoleDto } from '../../../application/dto/update-roles.dto';
import { CreateRoleUseCase } from '../../../application/use-cases/create-roles.use-case';
import { ListRolesUseCase } from '../../../application/use-cases/list-roles.use-case';
import { GetRoleByIdUseCase } from '../../../application/use-cases/get-roles-by-id.use-case';
import { UpdateRoleUseCase } from '../../../application/use-cases/update-roles.use-case';
import { DeleteRoleUseCase } from '../../../application/use-cases/delete-roles.use-case';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly createUseCase: CreateRoleUseCase,
    private readonly listUseCase: ListRolesUseCase,
    private readonly getByIdUseCase: GetRoleByIdUseCase,
    private readonly updateUseCase: UpdateRoleUseCase,
    private readonly deleteUseCase: DeleteRoleUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateRoleDto) {
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateRoleDto) {
    return this.updateUseCase.execute(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteUseCase.execute(id);
  }
}
