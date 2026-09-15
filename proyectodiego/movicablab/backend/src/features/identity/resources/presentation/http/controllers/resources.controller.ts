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
import { CreateResourceDto } from '../../../application/dto/create-resources.dto';
import { UpdateResourceDto } from '../../../application/dto/update-resources.dto';
import { CreateResourceUseCase } from '../../../application/use-cases/create-resources.use-case';
import { ListResourcesUseCase } from '../../../application/use-cases/list-resources.use-case';
import { GetResourceByIdUseCase } from '../../../application/use-cases/get-resources-by-id.use-case';
import { UpdateResourceUseCase } from '../../../application/use-cases/update-resources.use-case';
import { DeleteResourceUseCase } from '../../../application/use-cases/delete-resources.use-case';

@Controller('resources')
export class ResourcesController {
  constructor(
    private readonly createUseCase: CreateResourceUseCase,
    private readonly listUseCase: ListResourcesUseCase,
    private readonly getByIdUseCase: GetResourceByIdUseCase,
    private readonly updateUseCase: UpdateResourceUseCase,
    private readonly deleteUseCase: DeleteResourceUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateResourceDto) {
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateResourceDto) {
    return this.updateUseCase.execute(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteUseCase.execute(id);
  }
}
