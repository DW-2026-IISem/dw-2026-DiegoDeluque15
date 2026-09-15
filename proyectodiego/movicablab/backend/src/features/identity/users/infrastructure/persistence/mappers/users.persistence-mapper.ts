import { User } from '../../../domain/entities/users.entity';
import { UserModel } from '../models/users.model';

export class UserPersistenceMapper {
  static toDomain(model: UserModel): User {
    return new User(
      model.id,
      model.email,
      model.passwordHash,
      model.isActive
    );
  }

  static toModel(entity: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      email: entity.email,
      passwordHash: entity.passwordHash,
      isActive: entity.isActive
    };
  }
}
