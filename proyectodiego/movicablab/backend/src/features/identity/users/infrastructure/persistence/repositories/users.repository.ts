import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/users.repository.interface';
import { User } from '../../../domain/entities/users.entity';
import { UserModel } from '../models/users.model';
import { UserPersistenceMapper } from '../mappers/users.persistence-mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  async create(entity: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const data = UserPersistenceMapper.toModel(entity);
    const created = await UserModel.create(data);
    return UserPersistenceMapper.toDomain(created);
  }

  async findById(id: number): Promise<User | null> {
    const found = await UserModel.findByPk(id);
    return found ? UserPersistenceMapper.toDomain(found) : null;
  }

  async findAll(): Promise<User[]> {
    const list = await UserModel.findAll();
    return list.map(i => UserPersistenceMapper.toDomain(i));
  }

  async update(id: number, entity: User): Promise<User> {
    const data = UserPersistenceMapper.toModel(entity);
    await UserModel.update(data, { where: { id } });
    return entity;
  }

  async delete(id: number): Promise<void> {
    await UserModel.destroy({ where: { id } });
  }

  async findByEmail(val: string): Promise<User | null> {
    const found = await UserModel.findOne({ where: { email: val } });
    return found ? UserPersistenceMapper.toDomain(found) : null;
  }
}
