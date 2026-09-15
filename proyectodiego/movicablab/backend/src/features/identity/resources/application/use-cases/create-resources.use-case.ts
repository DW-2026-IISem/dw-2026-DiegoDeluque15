import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IResourceRepository } from '../../domain/interfaces/resources.repository.interface';
import { CreateResourceDto } from '../dto/create-resources.dto';
import { ResourceMapper } from '../mappers/resources.mapper';

@Injectable()
export class CreateResourceUseCase {
  constructor(@Inject('IResourceRepository') private readonly repository: IResourceRepository) {}

  async execute(dto: CreateResourceDto) {
    const existing = await this.repository.findByNombre(dto.nombre);
    if (existing) throw new ConflictException('Resource con este nombre ya existe');
    const created = await this.repository.create(dto as any);
    return ResourceMapper.toDto(created);
  }
}
