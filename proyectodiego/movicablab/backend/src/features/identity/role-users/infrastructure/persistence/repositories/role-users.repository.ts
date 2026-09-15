import { Injectable } from '@nestjs/common';
import { IRoleUserRepository } from '../../../domain/interfaces/role-users.repository.interface';
import { RoleUser } from '../../../domain/entities/role-users.entity';
import { RoleUserModel } from '../models/role-users.model';
import { RoleUserPersistenceMapper } from '../mappers/role-users.persistence-mapper';

@Injectable()
export class RoleUserRepository implements IRoleUserRepository {
  async create(entity: Omit<RoleUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoleUser> {
    const data = RoleUserPersistenceMapper.toModel(entity);
    const created = await RoleUserModel.create(data);
    return RoleUserPersistenceMapper.toDomain(created);
  }

  async findById(id: number): Promise<RoleUser | null> {
    const found = await RoleUserModel.findByPk(id);
    return found ? RoleUserPersistenceMapper.toDomain(found) : null;
  }

  async findAll(): Promise<RoleUser[]> {
    const list = await RoleUserModel.findAll();
    return list.map(i => RoleUserPersistenceMapper.toDomain(i));
  }

  async update(id: number, entity: RoleUser): Promise<RoleUser> {
    const data = RoleUserPersistenceMapper.toModel(entity);
    await RoleUserModel.update(data, { where: { id } });
    return entity;
  }

  async delete(id: number): Promise<void> {
    await RoleUserModel.destroy({ where: { id } });
  }

  async findByCombo(val1: number, val2: number): Promise<RoleUser | null> {
    const found = await RoleUserModel.findOne({ where: { userId: val1, roleId: val2 } });
    return found ? RoleUserPersistenceMapper.toDomain(found) : null;
  }
}
