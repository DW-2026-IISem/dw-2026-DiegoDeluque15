import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IResourceRepository } from '../../domain/interfaces/resources.repository.interface';
import { UpdateResourceDto } from '../dto/update-resources.dto';
import { ResourceMapper } from '../mappers/resources.mapper';

@Injectable()
export class UpdateResourceUseCase {
  constructor(@Inject('IResourceRepository') private readonly repository: IResourceRepository) {}

  async execute(id: number, dto: UpdateResourceDto) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('Resource no encontrado');
    entity.update(dto as any);
    const updated = await this.repository.update(id, entity);
    return ResourceMapper.toDto(updated);
  }
}
