import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/users.repository.interface';
import { UserMapper } from '../mappers/users.mapper';

@Injectable()
export class GetUserByIdUseCase {
  constructor(@Inject('IUserRepository') private readonly repository: IUserRepository) {}

  async execute(id: number) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('User no encontrado');
    return UserMapper.toDto(entity);
  }
}
