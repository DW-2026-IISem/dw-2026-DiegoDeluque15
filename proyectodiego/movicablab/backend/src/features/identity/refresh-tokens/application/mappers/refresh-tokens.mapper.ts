import { RefreshToken } from '../../domain/entities/refresh-tokens.entity';
import { CreateRefreshTokenDto } from '../dto/create-refresh-tokens.dto';

export class RefreshTokenMapper {
  static toDomain(dto: CreateRefreshTokenDto, id: number = 0): RefreshToken {
    return new RefreshToken(id, dto.userId, dto.tokenHash, dto.expiresAt, dto.revoked);
  }

  static toDto(entity: RefreshToken): any {
    return {
      id: entity.id,
      userId: entity.userId,
      tokenHash: entity.tokenHash,
      expiresAt: entity.expiresAt,
      revoked: entity.revoked,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
