import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import dbConfig from '../config/db.config';
import { AuthModule } from './auth/auth.module';
import * as models from './models';
import { PostsModule } from './post/posts.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './user/users.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...dbConfig,
      models: Object.values(models).filter(
        (model) => model.name !== 'BaseEntity',
      ),
      autoLoadModels: true,
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: `./environments/.env.${
        process.env.NODE_ENV || 'development'
      }`,
    }),
    SharedModule,
    UsersModule,
    PostsModule,
    AuthModule,
  ],
})
export class AppModule {}
