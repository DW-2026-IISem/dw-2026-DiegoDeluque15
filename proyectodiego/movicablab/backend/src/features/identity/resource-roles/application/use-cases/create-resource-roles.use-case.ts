import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IResourceRoleRepository } from '../../domain/interfaces/resource-roles.repository.interface';
import { CreateResourceRoleDto } from '../dto/create-resource-roles.dto';
import { ResourceRoleMapper } from '../mappers/resource-roles.mapper';

@Injectable()
export class CreateResourceRoleUseCase {
  constructor(@Inject('IResourceRoleRepository') private readonly repository: IResourceRoleRepository) {}

  async execute(dto: CreateResourceRoleDto) {
    const existing = await this.repository.findByCombo(dto.resourceId, dto.roleId);
    if (existing) throw new ConflictException('Combinación resourceId y roleId ya existe');
    const created = await this.repository.create(dto as any);
    return ResourceRoleMapper.toDto(created);
  }
}
