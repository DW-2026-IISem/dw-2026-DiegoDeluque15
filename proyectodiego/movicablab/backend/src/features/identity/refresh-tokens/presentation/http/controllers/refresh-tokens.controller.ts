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
import { CreateRefreshTokenDto } from '../../../application/dto/create-refresh-tokens.dto';
import { UpdateRefreshTokenDto } from '../../../application/dto/update-refresh-tokens.dto';
import { CreateRefreshTokenUseCase } from '../../../application/use-cases/create-refresh-tokens.use-case';
import { ListRefreshTokensUseCase } from '../../../application/use-cases/list-refreshtokens.use-case';
import { GetRefreshTokenByIdUseCase } from '../../../application/use-cases/get-refresh-tokens-by-id.use-case';
import { UpdateRefreshTokenUseCase } from '../../../application/use-cases/update-refresh-tokens.use-case';
import { DeleteRefreshTokenUseCase } from '../../../application/use-cases/delete-refresh-tokens.use-case';

@Controller('refresh-tokens')
export class RefreshTokensController {
  constructor(
    private readonly createUseCase: CreateRefreshTokenUseCase,
    private readonly listUseCase: ListRefreshTokensUseCase,
    private readonly getByIdUseCase: GetRefreshTokenByIdUseCase,
    private readonly updateUseCase: UpdateRefreshTokenUseCase,
    private readonly deleteUseCase: DeleteRefreshTokenUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateRefreshTokenDto) {
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateRefreshTokenDto) {
    return this.updateUseCase.execute(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteUseCase.execute(id);
  }
}
