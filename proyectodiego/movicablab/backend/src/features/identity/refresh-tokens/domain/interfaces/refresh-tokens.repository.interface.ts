import { RefreshToken } from '../entities/refresh-tokens.entity';
export interface IRefreshTokenRepository {
  create(entity: Omit<RefreshToken, 'id' | 'createdAt' | 'updatedAt'>): Promise<RefreshToken>;
  findById(id: number): Promise<RefreshToken | null>;
  findAll(): Promise<RefreshToken[]>;
  update(id: number, entity: RefreshToken): Promise<RefreshToken>;
  delete(id: number): Promise<void>;


}
