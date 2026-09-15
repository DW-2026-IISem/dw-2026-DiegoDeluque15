import { Injectable } from '@nestjs/common';
import { IResourceRepository } from '../../../domain/interfaces/resources.repository.interface';
import { Resource } from '../../../domain/entities/resources.entity';
import { ResourceModel } from '../models/resources.model';
import { ResourcePersistenceMapper } from '../mappers/resources.persistence-mapper';

@Injectable()
export class ResourceRepository implements IResourceRepository {
  async create(entity: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resource> {
    const data = ResourcePersistenceMapper.toModel(entity);
    const created = await ResourceModel.create(data);
    return ResourcePersistenceMapper.toDomain(created);
  }

  async findById(id: number): Promise<Resource | null> {
    const found = await ResourceModel.findByPk(id);
    return found ? ResourcePersistenceMapper.toDomain(found) : null;
  }

  async findAll(): Promise<Resource[]> {
    const list = await ResourceModel.findAll();
    return list.map(i => ResourcePersistenceMapper.toDomain(i));
  }

  async update(id: number, entity: Resource): Promise<Resource> {
    const data = ResourcePersistenceMapper.toModel(entity);
    await ResourceModel.update(data, { where: { id } });
    return entity;
  }

  async delete(id: number): Promise<void> {
    await ResourceModel.destroy({ where: { id } });
  }

  async findByNombre(val: string): Promise<Resource | null> {
    const found = await ResourceModel.findOne({ where: { nombre: val } });
    return found ? ResourcePersistenceMapper.toDomain(found) : null;
  }
}
