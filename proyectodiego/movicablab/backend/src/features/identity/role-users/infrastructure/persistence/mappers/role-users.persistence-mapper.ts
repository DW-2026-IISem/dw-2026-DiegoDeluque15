import { RoleUser } from '../../../domain/entities/role-users.entity';
import { RoleUserModel } from '../models/role-users.model';

export class RoleUserPersistenceMapper {
  static toDomain(model: RoleUserModel): RoleUser {
    return new RoleUser(
      model.id,
      model.userId,
      model.roleId,
      model.isActive
    );
  }

  static toModel(entity: Omit<RoleUser, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      userId: entity.userId,
      roleId: entity.roleId,
      isActive: entity.isActive
    };
  }
}
