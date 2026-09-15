import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IResourceRoleRepository } from '../../domain/interfaces/resource-roles.repository.interface';
import { UpdateResourceRoleDto } from '../dto/update-resource-roles.dto';
import { ResourceRoleMapper } from '../mappers/resource-roles.mapper';

@Injectable()
export class UpdateResourceRoleUseCase {
  constructor(@Inject('IResourceRoleRepository') private readonly repository: IResourceRoleRepository) {}

  async execute(id: number, dto: UpdateResourceRoleDto) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('ResourceRole no encontrado');
    entity.update(dto as any);
    const updated = await this.repository.update(id, entity);
    return ResourceRoleMapper.toDto(updated);
  }
}
