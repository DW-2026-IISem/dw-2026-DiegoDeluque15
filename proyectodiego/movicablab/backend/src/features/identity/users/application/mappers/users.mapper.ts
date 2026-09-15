import { User } from '../../domain/entities/users.entity';
import { CreateUserDto } from '../dto/create-users.dto';

export class UserMapper {
  static toDomain(dto: CreateUserDto, id: number = 0): User {
    return new User(id, dto.email, dto.passwordHash, dto.isActive);
  }

  static toDto(entity: User): any {
    return {
      id: entity.id,
      email: entity.email,
      // passwordHash omitido por seguridad,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
