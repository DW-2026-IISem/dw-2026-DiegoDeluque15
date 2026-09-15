import { Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from '../../../domain/interfaces/refresh-tokens.repository.interface';
import { RefreshToken } from '../../../domain/entities/refresh-tokens.entity';
import { RefreshTokenModel } from '../models/refresh-tokens.model';
import { RefreshTokenPersistenceMapper } from '../mappers/refresh-tokens.persistence-mapper';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(entity: Omit<RefreshToken, 'id' | 'createdAt' | 'updatedAt'>): Promise<RefreshToken> {
    const data = RefreshTokenPersistenceMapper.toModel(entity);
    const created = await RefreshTokenModel.create(data);
    return RefreshTokenPersistenceMapper.toDomain(created);
  }

  async findById(id: number): Promise<RefreshToken | null> {
    const found = await RefreshTokenModel.findByPk(id);
    return found ? RefreshTokenPersistenceMapper.toDomain(found) : null;
  }

  async findAll(): Promise<RefreshToken[]> {
    const list = await RefreshTokenModel.findAll();
    return list.map(i => RefreshTokenPersistenceMapper.toDomain(i));
  }

  async update(id: number, entity: RefreshToken): Promise<RefreshToken> {
    const data = RefreshTokenPersistenceMapper.toModel(entity);
    await RefreshTokenModel.update(data, { where: { id } });
    return entity;
  }

  async delete(id: number): Promise<void> {
    await RefreshTokenModel.destroy({ where: { id } });
  }
}
