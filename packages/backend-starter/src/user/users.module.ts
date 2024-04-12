import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileEntity, UserEntity } from '../models';
import { SharedModule } from '../shared/shared.module';
import { ProfileController } from './controllers/profile.controller';
import { UserController } from './controllers/user.controller';
import { ProfileService } from './services/profile.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    SequelizeModule.forFeature([UserEntity, ProfileEntity]),
    SharedModule,
  ],
  controllers: [UserController, ProfileController],
  providers: [UserService, ProfileService],
  exports: [UserService],
})
export class UsersModule {}
