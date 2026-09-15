import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '../../../domain/interfaces/roles.repository.interface';
import { Role } from '../../../domain/entities/roles.entity';
import { RoleModel } from '../models/roles.model';
import { RolePersistenceMapper } from '../mappers/roles.persistence-mapper';

@Injectable()
export class RoleRepository implements IRoleRepository {
  async create(entity: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> {
    const data = RolePersistenceMapper.toModel(entity);
    const created = await RoleModel.create(data);
    return RolePersistenceMapper.toDomain(created);
  }

  async findById(id: number): Promise<Role | null> {
    const found = await RoleModel.findByPk(id);
    return found ? RolePersistenceMapper.toDomain(found) : null;
  }

  async findAll(): Promise<Role[]> {
    const list = await RoleModel.findAll();
    return list.map(i => RolePersistenceMapper.toDomain(i));
  }

  async update(id: number, entity: Role): Promise<Role> {
    const data = RolePersistenceMapper.toModel(entity);
    await RoleModel.update(data, { where: { id } });
    return entity;
  }

  async delete(id: number): Promise<void> {
    await RoleModel.destroy({ where: { id } });
  }

  async findByNombre(val: string): Promise<Role | null> {
    const found = await RoleModel.findOne({ where: { nombre: val } });
    return found ? RolePersistenceMapper.toDomain(found) : null;
  }
}
