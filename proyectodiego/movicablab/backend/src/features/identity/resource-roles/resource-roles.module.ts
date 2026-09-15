import { Module } from '@nestjs/common';
import { ResourceRoleRepository } from './infrastructure/persistence/repositories/resource-roles.repository';
import { CreateResourceRoleUseCase } from './application/use-cases/create-resource-roles.use-case';
import { ListResourceRolesUseCase } from './application/use-cases/list-resourceroles.use-case';
import { GetResourceRoleByIdUseCase } from './application/use-cases/get-resource-roles-by-id.use-case';
import { UpdateResourceRoleUseCase } from './application/use-cases/update-resource-roles.use-case';
import { DeleteResourceRoleUseCase } from './application/use-cases/delete-resource-roles.use-case';
import { ResourceRolesController } from './presentation/http/controllers/resource-roles.controller';

@Module({
  controllers: [ResourceRolesController],
  providers: [
    { provide: 'IResourceRoleRepository', useClass: ResourceRoleRepository },
    CreateResourceRoleUseCase,
    ListResourceRolesUseCase,
    GetResourceRoleByIdUseCase,
    UpdateResourceRoleUseCase,
    DeleteResourceRoleUseCase,
  ],
})
export class ResourceRolesModule {}
