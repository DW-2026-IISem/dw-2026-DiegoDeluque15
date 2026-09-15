import { Resource } from '../../domain/entities/resources.entity';
import { CreateResourceDto } from '../dto/create-resources.dto';

export class ResourceMapper {
  static toDomain(dto: CreateResourceDto, id: number = 0): Resource {
    return new Resource(id, dto.nombre, dto.isActive);
  }

  static toDto(entity: Resource): any {
    return {
      id: entity.id,
      nombre: entity.nombre,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
