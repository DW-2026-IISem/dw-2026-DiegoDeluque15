import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRoleUserRepository } from '../../domain/interfaces/role-users.repository.interface';

@Injectable()
export class DeleteRoleUserUseCase {
  constructor(@Inject('IRoleUserRepository') private readonly repository: IRoleUserRepository) {}

  async execute(id: number) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('RoleUser no encontrado');
    await this.repository.delete(id);
  }
}
