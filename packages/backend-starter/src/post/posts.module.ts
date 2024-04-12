import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryEntity, PostEntity, TagEntity } from '../models';
import { SharedModule } from '../shared/shared.module';
import { CategoryController } from './controllers/category.controller';
import { PostController } from './controllers/post.controller';
import { TagController } from './controllers/tag.controller';
import { CategoryService } from './services/category.service';
import { PostService } from './services/post.service';
import { TagService } from './services/tag.service';

@Module({
  imports: [
    SequelizeModule.forFeature([PostEntity, CategoryEntity, TagEntity]),
    SharedModule,
  ],
  controllers: [PostController, CategoryController, TagController],
  providers: [PostService, CategoryService, TagService],
})
export class PostsModule {}
