import { Role } from '../../../domain/entities/roles.entity';
import { RoleModel } from '../models/roles.model';

export class RolePersistenceMapper {
  static toDomain(model: RoleModel): Role {
    return new Role(
      model.id,
      model.nombre,
      model.isActive
    );
  }

  static toModel(entity: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      nombre: entity.nombre,
      isActive: entity.isActive
    };
  }
}
