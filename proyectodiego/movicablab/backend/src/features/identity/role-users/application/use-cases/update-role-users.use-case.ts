import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRoleUserRepository } from '../../domain/interfaces/role-users.repository.interface';
import { UpdateRoleUserDto } from '../dto/update-role-users.dto';
import { RoleUserMapper } from '../mappers/role-users.mapper';

@Injectable()
export class UpdateRoleUserUseCase {
  constructor(@Inject('IRoleUserRepository') private readonly repository: IRoleUserRepository) {}

  async execute(id: number, dto: UpdateRoleUserDto) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('RoleUser no encontrado');
    entity.update(dto as any);
    const updated = await this.repository.update(id, entity);
    return RoleUserMapper.toDto(updated);
  }
}
