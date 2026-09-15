import { Module } from '@nestjs/common';
import { UserRepository } from './infrastructure/persistence/repositories/users.repository';
import { CreateUserUseCase } from './application/use-cases/create-users.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-users-by-id.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-users.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-users.use-case';
import { UsersController } from './presentation/http/controllers/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    { provide: 'IUserRepository', useClass: UserRepository },
    CreateUserUseCase,
    ListUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UsersModule {}
