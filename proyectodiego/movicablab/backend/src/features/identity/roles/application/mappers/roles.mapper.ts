import { Role } from '../../domain/entities/roles.entity';
import { CreateRoleDto } from '../dto/create-roles.dto';

export class RoleMapper {
  static toDomain(dto: CreateRoleDto, id: number = 0): Role {
    return new Role(id, dto.nombre, dto.isActive);
  }

  static toDto(entity: Role): any {
    return {
      id: entity.id,
      nombre: entity.nombre,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
