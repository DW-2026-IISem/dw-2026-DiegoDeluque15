import { ResourceRole } from '../entities/resource-roles.entity';
export interface IResourceRoleRepository {
  create(entity: Omit<ResourceRole, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResourceRole>;
  findById(id: number): Promise<ResourceRole | null>;
  findAll(): Promise<ResourceRole[]>;
  update(id: number, entity: ResourceRole): Promise<ResourceRole>;
  delete(id: number): Promise<void>;

  findByCombo(resourceId: number, roleId: number): Promise<ResourceRole | null>;
}
