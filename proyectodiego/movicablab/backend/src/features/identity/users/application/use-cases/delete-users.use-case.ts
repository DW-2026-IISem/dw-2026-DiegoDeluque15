import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/users.repository.interface';

@Injectable()
export class DeleteUserUseCase {
  constructor(@Inject('IUserRepository') private readonly repository: IUserRepository) {}

  async execute(id: number) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('User no encontrado');
    await this.repository.delete(id);
  }
}
