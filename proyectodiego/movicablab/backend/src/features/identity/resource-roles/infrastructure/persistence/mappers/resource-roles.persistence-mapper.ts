import { ResourceRole } from '../../../domain/entities/resource-roles.entity';
import { ResourceRoleModel } from '../models/resource-roles.model';

export class ResourceRolePersistenceMapper {
  static toDomain(model: ResourceRoleModel): ResourceRole {
    return new ResourceRole(
      model.id,
      model.resourceId,
      model.roleId,
      model.isActive
    );
  }

  static toModel(entity: Omit<ResourceRole, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      resourceId: entity.resourceId,
      roleId: entity.roleId,
      isActive: entity.isActive
    };
  }
}
