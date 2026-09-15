import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IResourceRoleRepository } from '../../domain/interfaces/resource-roles.repository.interface';
import { ResourceRoleMapper } from '../mappers/resource-roles.mapper';

@Injectable()
export class GetResourceRoleByIdUseCase {
  constructor(@Inject('IResourceRoleRepository') private readonly repository: IResourceRoleRepository) {}

  async execute(id: number) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('ResourceRole no encontrado');
    return ResourceRoleMapper.toDto(entity);
  }
}
