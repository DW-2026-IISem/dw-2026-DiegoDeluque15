import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/users.repository.interface';
import { UpdateUserDto } from '../dto/update-users.dto';
import { UserMapper } from '../mappers/users.mapper';

@Injectable()
export class UpdateUserUseCase {
  constructor(@Inject('IUserRepository') private readonly repository: IUserRepository) {}

  async execute(id: number, dto: UpdateUserDto) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('User no encontrado');
    entity.update(dto as any);
    const updated = await this.repository.update(id, entity);
    return UserMapper.toDto(updated);
  }
}
