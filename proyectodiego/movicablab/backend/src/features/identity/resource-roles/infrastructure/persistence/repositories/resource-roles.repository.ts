import { Injectable } from '@nestjs/common';
import { IResourceRoleRepository } from '../../../domain/interfaces/resource-roles.repository.interface';
import { ResourceRole } from '../../../domain/entities/resource-roles.entity';
import { ResourceRoleModel } from '../models/resource-roles.model';
import { ResourceRolePersistenceMapper } from '../mappers/resource-roles.persistence-mapper';

@Injectable()
export class ResourceRoleRepository implements IResourceRoleRepository {
  async create(entity: Omit<ResourceRole, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResourceRole> {
    const data = ResourceRolePersistenceMapper.toModel(entity);
    const created = await ResourceRoleModel.create(data);
    return ResourceRolePersistenceMapper.toDomain(created);
  }

  async findById(id: number): Promise<ResourceRole | null> {
    const found = await ResourceRoleModel.findByPk(id);
    return found ? ResourceRolePersistenceMapper.toDomain(found) : null;
  }

  async findAll(): Promise<ResourceRole[]> {
    const list = await ResourceRoleModel.findAll();
    return list.map(i => ResourceRolePersistenceMapper.toDomain(i));
  }

  async update(id: number, entity: ResourceRole): Promise<ResourceRole> {
    const data = ResourceRolePersistenceMapper.toModel(entity);
    await ResourceRoleModel.update(data, { where: { id } });
    return entity;
  }

  async delete(id: number): Promise<void> {
    await ResourceRoleModel.destroy({ where: { id } });
  }

  async findByCombo(val1: number, val2: number): Promise<ResourceRole | null> {
    const found = await ResourceRoleModel.findOne({ where: { resourceId: val1, roleId: val2 } });
    return found ? ResourceRolePersistenceMapper.toDomain(found) : null;
  }
}
