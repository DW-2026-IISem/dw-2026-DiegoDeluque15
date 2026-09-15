import { Module } from '@nestjs/common';
import { RefreshTokenRepository } from './infrastructure/persistence/repositories/refresh-tokens.repository';
import { CreateRefreshTokenUseCase } from './application/use-cases/create-refresh-tokens.use-case';
import { ListRefreshTokensUseCase } from './application/use-cases/list-refreshtokens.use-case';
import { GetRefreshTokenByIdUseCase } from './application/use-cases/get-refresh-tokens-by-id.use-case';
import { UpdateRefreshTokenUseCase } from './application/use-cases/update-refresh-tokens.use-case';
import { DeleteRefreshTokenUseCase } from './application/use-cases/delete-refresh-tokens.use-case';
import { RefreshTokensController } from './presentation/http/controllers/refresh-tokens.controller';

@Module({
  controllers: [RefreshTokensController],
  providers: [
    { provide: 'IRefreshTokenRepository', useClass: RefreshTokenRepository },
    CreateRefreshTokenUseCase,
    ListRefreshTokensUseCase,
    GetRefreshTokenByIdUseCase,
    UpdateRefreshTokenUseCase,
    DeleteRefreshTokenUseCase,
  ],
})
export class RefreshTokensModule {}
