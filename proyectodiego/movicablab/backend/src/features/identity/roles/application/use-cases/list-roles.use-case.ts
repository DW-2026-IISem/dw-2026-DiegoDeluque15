import { Inject, Injectable } from '@nestjs/common';
import { IRoleRepository } from '../../domain/interfaces/roles.repository.interface';
import { RoleMapper } from '../mappers/roles.mapper';

@Injectable()
export class ListRolesUseCase {
  constructor(@Inject('IRoleRepository') private readonly repository: IRoleRepository) {}

  async execute() {
    const entities = await this.repository.findAll();
    return entities.map(e => RoleMapper.toDto(e));
  }
}
