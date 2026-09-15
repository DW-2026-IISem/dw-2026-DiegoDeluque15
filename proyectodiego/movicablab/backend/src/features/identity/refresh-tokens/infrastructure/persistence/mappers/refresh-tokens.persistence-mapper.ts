import { RefreshToken } from '../../../domain/entities/refresh-tokens.entity';
import { RefreshTokenModel } from '../models/refresh-tokens.model';

export class RefreshTokenPersistenceMapper {
  static toDomain(model: RefreshTokenModel): RefreshToken {
    return new RefreshToken(
      model.id,
      model.userId,
      model.tokenHash,
      model.expiresAt,
      model.revoked
    );
  }

  static toModel(entity: Omit<RefreshToken, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      userId: entity.userId,
      tokenHash: entity.tokenHash,
      expiresAt: entity.expiresAt,
      revoked: entity.revoked
    };
  }
}
