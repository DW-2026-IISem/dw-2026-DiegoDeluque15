import { ResourceRole } from '../../domain/entities/resource-roles.entity';
import { CreateResourceRoleDto } from '../dto/create-resource-roles.dto';

export class ResourceRoleMapper {
  static toDomain(dto: CreateResourceRoleDto, id: number = 0): ResourceRole {
    return new ResourceRole(id, dto.resourceId, dto.roleId, dto.isActive);
  }

  static toDto(entity: ResourceRole): any {
    return {
      id: entity.id,
      resourceId: entity.resourceId,
      roleId: entity.roleId,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
