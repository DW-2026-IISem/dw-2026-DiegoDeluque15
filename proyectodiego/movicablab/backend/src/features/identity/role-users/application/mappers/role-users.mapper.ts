import { RoleUser } from '../../domain/entities/role-users.entity';
import { CreateRoleUserDto } from '../dto/create-role-users.dto';

export class RoleUserMapper {
  static toDomain(dto: CreateRoleUserDto, id: number = 0): RoleUser {
    return new RoleUser(id, dto.userId, dto.roleId, dto.isActive);
  }

  static toDto(entity: RoleUser): any {
    return {
      id: entity.id,
      userId: entity.userId,
      roleId: entity.roleId,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
