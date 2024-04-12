import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostEntity, ProfileEntity, UserEntity } from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import { NodeConfigService } from '../../shared/services/node-config.service';
import { UserWithoutPassword } from '../../user/types/user-types.type';
import { CreatePostDto } from '../dto/create-post.dto';
import { PatchPostDto } from '../dto/patch-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostService {
  private readonly takeLimit: number;

  constructor(
    @InjectModel(PostEntity)
    private readonly Post: typeof PostEntity,
    private readonly nodeConfigService: NodeConfigService,
  ) {
    this.takeLimit = +this.nodeConfigService.config.get<number>('post.takeMax');
  }

  public find(query?: IAppQueryString): Promise<PostEntity[]> {
    const { pageSize = this.takeLimit, pageIndex = 0, filter } = query;

    return this.Post.findAll({
      limit: pageSize,
      offset: pageIndex * pageSize,
      where: {
        ...filter,
      },
      attributes: {
        exclude: ['userId'],
      },
      include: [
        {
          model: UserEntity,
          include: [
            {
              model: ProfileEntity,
              attributes: {
                exclude: ['userId'],
              },
            },
          ],
        },
      ],
    });
  }

  public findById(id: string): Promise<PostEntity | null> {
    return this.Post.findByPk(id, {
      attributes: {
        exclude: ['userId'],
      },
      include: [
        {
          model: UserEntity,
          include: [
            {
              model: ProfileEntity,
              attributes: {
                exclude: ['userId'],
              },
            },
          ],
        },
      ],
    });
  }

  public async count(query?: IAppQueryString): Promise<{ count: number }> {
    const { filter } = query;

    const count = await this.Post.count({
      where: {
        ...filter,
      },
    });

    return { count };
  }

  public create(
    { title, content = 'should be completed', type, published }: CreatePostDto,
    loggedUser: UserWithoutPassword,
  ): Promise<PostEntity> {
    return this.Post.create({
      title,
      content,
      type,
      published,
      authorId: loggedUser.id,
    });
  }

  public async overwrite(
    id: string,
    data: UpdatePostDto,
  ): Promise<PostEntity | undefined> {
    const postFounded = await this.findById(id);

    if (postFounded) {
      postFounded.title = data.title;
      postFounded.content = data.content;
      postFounded.type = data.type;
      postFounded.published = data.published;

      return postFounded.save();
    }
  }

  public async update(
    id: string,
    data: PatchPostDto,
  ): Promise<PostEntity | undefined> {
    const postFounded = await this.findById(id);

    if (postFounded) {
      if (data.title) {
        postFounded.title = data.title;
      }

      if (data.content != null) {
        postFounded.content = data.content;
      }

      if (data.type) {
        postFounded.type = data.type;
      }

      if (data.published != null) {
        postFounded.published = data.published;
      }

      return postFounded.save();
    }
  }

  public async remove(id: string): Promise<{ deleted: number }> {
    const postFounded = await this.findById(id);

    if (!postFounded) {
      throw new NotFoundException('post_exception_not_found');
    }

    const deleted = await this.Post.destroy({ where: { id } });

    return { deleted };
  }
}
