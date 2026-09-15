import { Resource } from '../../../domain/entities/resources.entity';
import { ResourceModel } from '../models/resources.model';

export class ResourcePersistenceMapper {
  static toDomain(model: ResourceModel): Resource {
    return new Resource(
      model.id,
      model.nombre,
      model.isActive
    );
  }

  static toModel(entity: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      nombre: entity.nombre,
      isActive: entity.isActive
    };
  }
}
