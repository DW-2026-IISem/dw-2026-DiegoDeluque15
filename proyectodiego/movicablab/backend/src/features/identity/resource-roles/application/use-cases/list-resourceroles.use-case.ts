import { Inject, Injectable } from '@nestjs/common';
import { IResourceRoleRepository } from '../../domain/interfaces/resource-roles.repository.interface';
import { ResourceRoleMapper } from '../mappers/resource-roles.mapper';

@Injectable()
export class ListResourceRolesUseCase {
  constructor(@Inject('IResourceRoleRepository') private readonly repository: IResourceRoleRepository) {}

  async execute() {
    const entities = await this.repository.findAll();
    return entities.map(e => ResourceRoleMapper.toDto(e));
  }
}
