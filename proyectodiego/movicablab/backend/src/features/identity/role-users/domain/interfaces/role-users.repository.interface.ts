import { RoleUser } from '../entities/role-users.entity';
export interface IRoleUserRepository {
  create(entity: Omit<RoleUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoleUser>;
  findById(id: number): Promise<RoleUser | null>;
  findAll(): Promise<RoleUser[]>;
  update(id: number, entity: RoleUser): Promise<RoleUser>;
  delete(id: number): Promise<void>;

  findByCombo(userId: number, roleId: number): Promise<RoleUser | null>;
}
