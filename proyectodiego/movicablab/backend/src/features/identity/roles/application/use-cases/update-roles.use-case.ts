import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRoleRepository } from '../../domain/interfaces/roles.repository.interface';
import { UpdateRoleDto } from '../dto/update-roles.dto';
import { RoleMapper } from '../mappers/roles.mapper';

@Injectable()
export class UpdateRoleUseCase {
  constructor(@Inject('IRoleRepository') private readonly repository: IRoleRepository) {}

  async execute(id: number, dto: UpdateRoleDto) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('Role no encontrado');
    entity.update(dto as any);
    const updated = await this.repository.update(id, entity);
    return RoleMapper.toDto(updated);
  }
}
