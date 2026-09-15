import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRefreshTokenRepository } from '../../domain/interfaces/refresh-tokens.repository.interface';
import { UpdateRefreshTokenDto } from '../dto/update-refresh-tokens.dto';
import { RefreshTokenMapper } from '../mappers/refresh-tokens.mapper';

@Injectable()
export class UpdateRefreshTokenUseCase {
  constructor(@Inject('IRefreshTokenRepository') private readonly repository: IRefreshTokenRepository) {}

  async execute(id: number, dto: UpdateRefreshTokenDto) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('RefreshToken no encontrado');
    entity.update(dto as any);
    const updated = await this.repository.update(id, entity);
    return RefreshTokenMapper.toDto(updated);
  }
}
