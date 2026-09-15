import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IRoleUserRepository } from '../../domain/interfaces/role-users.repository.interface';
import { CreateRoleUserDto } from '../dto/create-role-users.dto';
import { RoleUserMapper } from '../mappers/role-users.mapper';

@Injectable()
export class CreateRoleUserUseCase {
  constructor(@Inject('IRoleUserRepository') private readonly repository: IRoleUserRepository) {}

  async execute(dto: CreateRoleUserDto) {
    const existing = await this.repository.findByCombo(dto.userId, dto.roleId);
    if (existing) throw new ConflictException('Combinación userId y roleId ya existe');
    const created = await this.repository.create(dto as any);
    return RoleUserMapper.toDto(created);
  }
}
