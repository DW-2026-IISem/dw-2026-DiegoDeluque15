import { Module } from '@nestjs/common';
import { ResourceRepository } from './infrastructure/persistence/repositories/resources.repository';
import { CreateResourceUseCase } from './application/use-cases/create-resources.use-case';
import { ListResourcesUseCase } from './application/use-cases/list-resources.use-case';
import { GetResourceByIdUseCase } from './application/use-cases/get-resources-by-id.use-case';
import { UpdateResourceUseCase } from './application/use-cases/update-resources.use-case';
import { DeleteResourceUseCase } from './application/use-cases/delete-resources.use-case';
import { ResourcesController } from './presentation/http/controllers/resources.controller';

@Module({
  controllers: [ResourcesController],
  providers: [
    { provide: 'IResourceRepository', useClass: ResourceRepository },
    CreateResourceUseCase,
    ListResourcesUseCase,
    GetResourceByIdUseCase,
    UpdateResourceUseCase,
    DeleteResourceUseCase,
  ],
})
export class ResourcesModule {}
