import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostEntity, TagEntity } from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import { NodeConfigService } from '../../shared/services/node-config.service';
import { CreateTagDto } from '../dto/create-tag.dto';
import { PatchCategoryDto } from '../dto/patch-category.dto';

@Injectable()
export class TagService {
  private takeLimit: number;

  constructor(
    @InjectModel(TagEntity) private readonly Tag: typeof TagEntity,
    private readonly nodeConfig: NodeConfigService,
  ) {
    this.takeLimit = this.nodeConfig.config.get('tag.takeMax');
  }

  public find(query: IAppQueryString): Promise<TagEntity[]> {
    const { filter, order, pageIndex = 0, pageSize = this.takeLimit } = query;

    return this.Tag.findAll({
      limit: pageSize,
      offset: pageIndex * pageSize,
      where: {
        ...filter,
      },
      include: [PostEntity],
      order,
    });
  }

  public findById(id: string): Promise<TagEntity> {
    return this.Tag.findByPk(id);
  }

  public async count(query?: IAppQueryString): Promise<{ count: number }> {
    const { filter } = query;

    const count = await this.Tag.count({
      where: {
        ...filter,
      },
    });

    return { count };
  }

  public create({ name }: CreateTagDto): Promise<TagEntity> {
    return this.Tag.create({
      name,
    });
  }

  public async overwrite(id: string, data: CreateTagDto): Promise<TagEntity> {
    const categoryFounded = await this.findById(id);

    if (categoryFounded) {
      categoryFounded.name = data.name;

      return categoryFounded.save();
    }
  }

  public async update(id: string, data: PatchCategoryDto): Promise<TagEntity> {
    const tagFounded = await this.findById(id);

    if (tagFounded) {
      if (data.name) {
        tagFounded.name = data.name;
      }

      return tagFounded.save();
    }
  }

  public async remove(id: string): Promise<{ deleted: number }> {
    const categoryFounded = await this.findById(id);

    if (!categoryFounded) {
      throw new NotFoundException('category_exception_not_found');
    }

    const deleted = await this.Tag.destroy({ where: { id } });

    return { deleted };
  }
}
