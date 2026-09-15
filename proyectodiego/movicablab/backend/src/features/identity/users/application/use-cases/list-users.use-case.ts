import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/users.repository.interface';
import { UserMapper } from '../mappers/users.mapper';

@Injectable()
export class ListUsersUseCase {
  constructor(@Inject('IUserRepository') private readonly repository: IUserRepository) {}

  async execute() {
    const entities = await this.repository.findAll();
    return entities.map(e => UserMapper.toDto(e));
  }
}
