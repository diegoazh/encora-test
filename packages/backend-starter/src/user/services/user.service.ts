import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostEntity, ProfileEntity, UserEntity } from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import { BcryptService } from '../../shared/services/bcrypt.service';
import { NodeConfigService } from '../../shared/services/node-config.service';
import { UserRole } from '../constants/user.constant';
import { CreateUserDto } from '../dto/create-user.dto';
import { PatchUserDto } from '../dto/patch-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserWithoutPassword } from '../types/user-types.type';

@Injectable()
export class UserService {
  private readonly takeLimit: number;

  constructor(
    @InjectModel(UserEntity)
    private readonly User: typeof UserEntity,
    private readonly bcrypt: BcryptService,
    private readonly nodeConfigService: NodeConfigService,
  ) {
    this.takeLimit = this.nodeConfigService.config.get<number>('user.takeMax');
  }

  public find(query?: IAppQueryString): Promise<UserEntity[]> {
    const { pageSize = this.takeLimit, pageIndex = 0, filter } = query;

    return this.User.findAll({
      limit: pageSize,
      offset: pageIndex * pageSize,
      where: {
        ...filter,
      },
      include: [
        {
          model: ProfileEntity,
          attributes: {
            exclude: ['userId'],
          },
        },
        {
          model: PostEntity,
          attributes: {
            exclude: ['userId'],
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  public findById(id: string): Promise<UserEntity | null> {
    return this.User.findByPk(id);
  }

  public findOne(userData: UserWithoutPassword): Promise<UserEntity> {
    return this.User.findOne({
      where: {
        ...(userData as any),
      },
      include: [
        {
          model: ProfileEntity,
          attributes: {
            exclude: ['userId'],
          },
        },
        {
          model: PostEntity,
          attributes: {
            exclude: ['userId'],
          },
        },
      ],
    });
  }

  public async count(query?: IAppQueryString): Promise<{ count: number }> {
    const { filter } = query;

    const count = await this.User.count({
      where: {
        ...filter,
      },
    });

    return { count };
  }

  public create(data: CreateUserDto): Promise<UserEntity> {
    const password = this.bcrypt.hashPassword(data.password);

    return this.User.create({ ...data, password, role: UserRole.USER });
  }

  public async overwrite(
    id: string,
    data: UpdateUserDto,
  ): Promise<UserEntity | undefined> {
    const savedUser = await this.findById(id);

    if (savedUser) {
      savedUser.email = data.email;
      savedUser.password = this.bcrypt.hashPassword(data.password);
      savedUser.username = data.username;

      return savedUser.save();
    }
  }

  public async update(
    id: string,
    data: PatchUserDto,
  ): Promise<UserEntity | undefined> {
    const savedUser = await this.findById(id);

    if (savedUser) {
      if (data.email) {
        savedUser.email = data.email;
      }

      if (data.password) {
        savedUser.password = this.bcrypt.hashPassword(data.password);
      }

      if (data.username) {
        savedUser.username = data.username;
      }

      return savedUser.save();
    }
  }

  public async remove(id: string): Promise<{ deleted: number }> {
    const savedUser = await this.findById(id);

    if (!savedUser) {
      throw new NotFoundException({ message: 'user_exception_not_found' });
    }

    const deleted = await this.User.destroy({ where: { id } });

    return { deleted };
  }
}
