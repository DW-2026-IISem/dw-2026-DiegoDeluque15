import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRefreshTokenRepository } from '../../domain/interfaces/refresh-tokens.repository.interface';
import { RefreshTokenMapper } from '../mappers/refresh-tokens.mapper';

@Injectable()
export class GetRefreshTokenByIdUseCase {
  constructor(@Inject('IRefreshTokenRepository') private readonly repository: IRefreshTokenRepository) {}

  async execute(id: number) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('RefreshToken no encontrado');
    return RefreshTokenMapper.toDto(entity);
  }
}
