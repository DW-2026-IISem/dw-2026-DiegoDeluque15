import { Inject, Injectable } from '@nestjs/common';
import { IRoleUserRepository } from '../../domain/interfaces/role-users.repository.interface';
import { RoleUserMapper } from '../mappers/role-users.mapper';

@Injectable()
export class ListRoleUsersUseCase {
  constructor(@Inject('IRoleUserRepository') private readonly repository: IRoleUserRepository) {}

  async execute() {
    const entities = await this.repository.findAll();
    return entities.map(e => RoleUserMapper.toDto(e));
  }
}
