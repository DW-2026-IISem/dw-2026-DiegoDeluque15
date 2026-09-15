import { Module } from '@nestjs/common';
import { RoleUserRepository } from './infrastructure/persistence/repositories/role-users.repository';
import { CreateRoleUserUseCase } from './application/use-cases/create-role-users.use-case';
import { ListRoleUsersUseCase } from './application/use-cases/list-roleusers.use-case';
import { GetRoleUserByIdUseCase } from './application/use-cases/get-role-users-by-id.use-case';
import { UpdateRoleUserUseCase } from './application/use-cases/update-role-users.use-case';
import { DeleteRoleUserUseCase } from './application/use-cases/delete-role-users.use-case';
import { RoleUsersController } from './presentation/http/controllers/role-users.controller';

@Module({
  controllers: [RoleUsersController],
  providers: [
    { provide: 'IRoleUserRepository', useClass: RoleUserRepository },
    CreateRoleUserUseCase,
    ListRoleUsersUseCase,
    GetRoleUserByIdUseCase,
    UpdateRoleUserUseCase,
    DeleteRoleUserUseCase,
  ],
})
export class RoleUsersModule {}
