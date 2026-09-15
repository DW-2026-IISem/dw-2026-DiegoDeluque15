import { Module } from '@nestjs/common';
import { RoleRepository } from './infrastructure/persistence/repositories/roles.repository';
import { CreateRoleUseCase } from './application/use-cases/create-roles.use-case';
import { ListRolesUseCase } from './application/use-cases/list-roles.use-case';
import { GetRoleByIdUseCase } from './application/use-cases/get-roles-by-id.use-case';
import { UpdateRoleUseCase } from './application/use-cases/update-roles.use-case';
import { DeleteRoleUseCase } from './application/use-cases/delete-roles.use-case';
import { RolesController } from './presentation/http/controllers/roles.controller';

@Module({
  controllers: [RolesController],
  providers: [
    { provide: 'IRoleRepository', useClass: RoleRepository },
    CreateRoleUseCase,
    ListRolesUseCase,
    GetRoleByIdUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
  ],
})
export class RolesModule {}
