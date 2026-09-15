import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRoleUserRepository } from '../../domain/interfaces/role-users.repository.interface';
import { RoleUserMapper } from '../mappers/role-users.mapper';

@Injectable()
export class GetRoleUserByIdUseCase {
  constructor(@Inject('IRoleUserRepository') private readonly repository: IRoleUserRepository) {}

  async execute(id: number) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('RoleUser no encontrado');
    return RoleUserMapper.toDto(entity);
  }
}
