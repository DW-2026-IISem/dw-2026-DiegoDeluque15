import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IResourceRepository } from '../../domain/interfaces/resources.repository.interface';
import { ResourceMapper } from '../mappers/resources.mapper';

@Injectable()
export class GetResourceByIdUseCase {
  constructor(@Inject('IResourceRepository') private readonly repository: IResourceRepository) {}

  async execute(id: number) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('Resource no encontrado');
    return ResourceMapper.toDto(entity);
  }
}
