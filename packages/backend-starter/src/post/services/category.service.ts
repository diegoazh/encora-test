import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryEntity, PostEntity } from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import { NodeConfigService } from '../../shared/services/node-config.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { PatchCategoryDto } from '../dto/patch-category.dto';

@Injectable()
export class CategoryService {
  private takeLimit: number;

  constructor(
    @InjectModel(CategoryEntity)
    private readonly Category: typeof CategoryEntity,
    private readonly nodeConfig: NodeConfigService,
  ) {
    this.takeLimit = this.nodeConfig.config.get<number>('category.takeMax');
  }

  public find(query: IAppQueryString): Promise<CategoryEntity[]> {
    const { filter, order, pageIndex = 0, pageSize = this.takeLimit } = query;

    return this.Category.findAll({
      limit: pageSize,
      offset: pageIndex * pageSize,
      where: {
        ...filter,
      },
      include: [PostEntity],
      order,
    });
  }

  public findById(id: string): Promise<CategoryEntity | null> {
    return this.Category.findByPk(id);
  }

  public async count(query?: IAppQueryString): Promise<{ count: number }> {
    const { filter } = query;

    const count = await this.Category.count({
      where: {
        ...filter,
      },
    });

    return { count };
  }

  public create({ name }: CreateCategoryDto): Promise<CategoryEntity> {
    return this.Category.create({
      name,
    });
  }

  public async overwrite(
    id: string,
    data: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const categoryFounded = await this.findById(id);

    if (categoryFounded) {
      categoryFounded.name = data.name;

      return categoryFounded.save();
    }
  }

  public async update(
    id: string,
    data: PatchCategoryDto,
  ): Promise<CategoryEntity> {
    const categoryFounded = await this.findById(id);

    if (categoryFounded) {
      if (data.name) {
        categoryFounded.name = data.name;
      }

      return categoryFounded.save();
    }
  }

  public async remove(id: string): Promise<{ deleted: number }> {
    const categoryFounded = await this.findById(id);

    if (!categoryFounded) {
      throw new NotFoundException('category_exception_not_found');
    }

    const deleted = await this.Category.destroy({ where: { id } });

    return { deleted };
  }
}
