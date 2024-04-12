import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProfileEntity, UserEntity } from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import { NodeConfigService } from '../../shared/services/node-config.service';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { PatchProfileDto } from '../dto/patch-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserWithoutPassword } from '../types/user-types.type';

@Injectable()
export class ProfileService {
  private readonly takeLimit: number;

  constructor(
    @InjectModel(ProfileEntity)
    private readonly Profile: typeof ProfileEntity,
    private readonly nodeConfigService: NodeConfigService,
  ) {
    this.takeLimit =
      this.nodeConfigService.config.get<number>('profile.takeMax');
  }

  public find(query?: IAppQueryString): Promise<ProfileEntity[]> {
    const { pageSize = this.takeLimit, pageIndex = 0, filter } = query;

    return this.Profile.findAll({
      limit: pageSize,
      offset: pageIndex * pageSize,
      where: {
        ...filter,
      },
      attributes: {
        exclude: ['userId'],
      },
      include: [UserEntity],
    });
  }

  public findById(id: string): Promise<ProfileEntity | null> {
    return this.Profile.findByPk(id);
  }

  public async count(query?: IAppQueryString): Promise<{ count: number }> {
    const { filter } = query;

    const count = await this.Profile.count({
      where: {
        ...filter,
      },
    });

    return { count };
  }

  public create(
    { bio, firstName, lastName }: CreateProfileDto,
    loggedUser: UserWithoutPassword,
  ): Promise<ProfileEntity> {
    return this.Profile.create({
      bio,
      firstName,
      lastName,
      userId: loggedUser.id,
    });
  }

  public async overwrite(
    id: string,
    data: UpdateProfileDto,
  ): Promise<ProfileEntity | undefined> {
    const savedProfile = await this.findById(id);

    if (savedProfile) {
      savedProfile.bio = data.bio;
      savedProfile.firstName = data.firstName;
      savedProfile.lastName = data.lastName;

      return savedProfile.save();
    }
  }

  public async update(
    id: string,
    data: PatchProfileDto,
  ): Promise<ProfileEntity | undefined> {
    const savedProfile = await this.findById(id);

    if (savedProfile) {
      if (data.bio) {
        savedProfile.bio = data.bio;
      }

      if (data.firstName) {
        savedProfile.firstName = data.firstName;
      }

      if (data.lastName) {
        savedProfile.lastName = data.lastName;
      }

      return savedProfile.save();
    }
  }

  public async remove(id: string): Promise<{ deleted: number }> {
    const savedProfile = await this.findById(id);

    if (!savedProfile) {
      throw new NotFoundException('profile_exception_not_found');
    }

    const deleted = await this.Profile.destroy({ where: { id } });

    return { deleted };
  }
}
