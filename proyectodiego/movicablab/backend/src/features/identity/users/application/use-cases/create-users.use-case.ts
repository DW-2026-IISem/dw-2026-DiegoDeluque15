import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/users.repository.interface';
import { CreateUserDto } from '../dto/create-users.dto';
import { UserMapper } from '../mappers/users.mapper';

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject('IUserRepository') private readonly repository: IUserRepository) {}

  async execute(dto: CreateUserDto) {
    const existing = await this.repository.findByEmail(dto.email);
    if (existing) throw new ConflictException('User con este email ya existe');
    const created = await this.repository.create(dto as any);
    return UserMapper.toDto(created);
  }
}
