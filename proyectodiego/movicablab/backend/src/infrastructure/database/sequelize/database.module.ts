import { Global, Inject, Module, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { runSeeders } from '../seeders/seed.runner';
import { createSequelizeInstance } from './sequelize.factory';
import { SEQUELIZE } from './sequelize.constants';

@Global()
@Module({
  providers: [
    {
      provide: SEQUELIZE,
      useFactory: () => createSequelizeInstance(),
    },
  ],
  exports: [SEQUELIZE],
})
export class DatabaseModule implements OnModuleInit {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  async onModuleInit(): Promise<void> {
    await this.sequelize.authenticate();
    await this.sequelize.sync({ alter: false });
    await runSeeders(this.sequelize);
  }
}
