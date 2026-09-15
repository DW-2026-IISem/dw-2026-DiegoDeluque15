import { Inject, Injectable } from '@nestjs/common';
import { IResourceRepository } from '../../domain/interfaces/resources.repository.interface';
import { ResourceMapper } from '../mappers/resources.mapper';

@Injectable()
export class ListResourcesUseCase {
  constructor(@Inject('IResourceRepository') private readonly repository: IResourceRepository) {}

  async execute() {
    const entities = await this.repository.findAll();
    return entities.map(e => ResourceMapper.toDto(e));
  }
}
