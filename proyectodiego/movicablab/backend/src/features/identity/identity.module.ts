import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { RoleUsersModule } from './role-users/role-users.module';
import { ResourcesModule } from './resources/resources.module';
import { ResourceRolesModule } from './resource-roles/resource-roles.module';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    RoleUsersModule,
    ResourcesModule,
    ResourceRolesModule,
    RefreshTokensModule,
  ],
})
export class IdentityModule {}
