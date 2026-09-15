import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRoleRepository } from '../../domain/interfaces/roles.repository.interface';
import { RoleMapper } from '../mappers/roles.mapper';

@Injectable()
export class GetRoleByIdUseCase {
  constructor(@Inject('IRoleRepository') private readonly repository: IRoleRepository) {}

  async execute(id: number) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('Role no encontrado');
    return RoleMapper.toDto(entity);
  }
}
