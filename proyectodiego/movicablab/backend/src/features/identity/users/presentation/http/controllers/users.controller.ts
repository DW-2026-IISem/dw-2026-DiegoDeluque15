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
import { CreateUserDto } from '../../../application/dto/create-users.dto';
import { UpdateUserDto } from '../../../application/dto/update-users.dto';
import { CreateUserUseCase } from '../../../application/use-cases/create-users.use-case';
import { ListUsersUseCase } from '../../../application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '../../../application/use-cases/get-users-by-id.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/update-users.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-users.use-case';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUseCase: CreateUserUseCase,
    private readonly listUseCase: ListUsersUseCase,
    private readonly getByIdUseCase: GetUserByIdUseCase,
    private readonly updateUseCase: UpdateUserUseCase,
    private readonly deleteUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateUserDto) {
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUserDto) {
    return this.updateUseCase.execute(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteUseCase.execute(id);
  }
}
