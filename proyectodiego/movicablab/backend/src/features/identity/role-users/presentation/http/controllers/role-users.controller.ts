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
import { CreateRoleUserDto } from '../../../application/dto/create-role-users.dto';
import { UpdateRoleUserDto } from '../../../application/dto/update-role-users.dto';
import { CreateRoleUserUseCase } from '../../../application/use-cases/create-role-users.use-case';
import { ListRoleUsersUseCase } from '../../../application/use-cases/list-roleusers.use-case';
import { GetRoleUserByIdUseCase } from '../../../application/use-cases/get-role-users-by-id.use-case';
import { UpdateRoleUserUseCase } from '../../../application/use-cases/update-role-users.use-case';
import { DeleteRoleUserUseCase } from '../../../application/use-cases/delete-role-users.use-case';

@Controller('role-users')
export class RoleUsersController {
  constructor(
    private readonly createUseCase: CreateRoleUserUseCase,
    private readonly listUseCase: ListRoleUsersUseCase,
    private readonly getByIdUseCase: GetRoleUserByIdUseCase,
    private readonly updateUseCase: UpdateRoleUserUseCase,
    private readonly deleteUseCase: DeleteRoleUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateRoleUserDto) {
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateRoleUserDto) {
    return this.updateUseCase.execute(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteUseCase.execute(id);
  }
}
