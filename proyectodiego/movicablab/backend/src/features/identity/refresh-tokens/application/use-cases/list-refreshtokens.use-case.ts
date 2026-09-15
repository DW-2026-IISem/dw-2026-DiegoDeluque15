import { Inject, Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from '../../domain/interfaces/refresh-tokens.repository.interface';
import { RefreshTokenMapper } from '../mappers/refresh-tokens.mapper';

@Injectable()
export class ListRefreshTokensUseCase {
  constructor(@Inject('IRefreshTokenRepository') private readonly repository: IRefreshTokenRepository) {}

  async execute() {
    const entities = await this.repository.findAll();
    return entities.map(e => RefreshTokenMapper.toDto(e));
  }
}
