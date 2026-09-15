import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRoleRepository } from '../../domain/interfaces/roles.repository.interface';

@Injectable()
export class DeleteRoleUseCase {
  constructor(@Inject('IRoleRepository') private readonly repository: IRoleRepository) {}

  async execute(id: number) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('Role no encontrado');
    await this.repository.delete(id);
  }
}
