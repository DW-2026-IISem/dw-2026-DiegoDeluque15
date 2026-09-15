import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IRoleRepository } from '../../domain/interfaces/roles.repository.interface';
import { CreateRoleDto } from '../dto/create-roles.dto';
import { RoleMapper } from '../mappers/roles.mapper';

@Injectable()
export class CreateRoleUseCase {
  constructor(@Inject('IRoleRepository') private readonly repository: IRoleRepository) {}

  async execute(dto: CreateRoleDto) {
    const existing = await this.repository.findByNombre(dto.nombre);
    if (existing) throw new ConflictException('Role con este nombre ya existe');
    const created = await this.repository.create(dto as any);
    return RoleMapper.toDto(created);
  }
}
