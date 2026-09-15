import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IRefreshTokenRepository } from '../../domain/interfaces/refresh-tokens.repository.interface';
import { CreateRefreshTokenDto } from '../dto/create-refresh-tokens.dto';
import { RefreshTokenMapper } from '../mappers/refresh-tokens.mapper';

@Injectable()
export class CreateRefreshTokenUseCase {
  constructor(@Inject('IRefreshTokenRepository') private readonly repository: IRefreshTokenRepository) {}

  async execute(dto: CreateRefreshTokenDto) {
    const created = await this.repository.create(dto as any);
    return RefreshTokenMapper.toDto(created);
  }
}
