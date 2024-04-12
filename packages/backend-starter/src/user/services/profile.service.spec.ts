import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfileEntity, UserEntity } from '../../models';
import { NodeConfigService } from '../../shared/services/node-config.service';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { PatchProfileDto } from '../dto/patch-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileService } from './profile.service';

const profileMock = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
};

const nodeConfigServiceMock = {
  config: {
    get: jest.fn(() => 200),
  },
};

describe('ProfileService', () => {
  let service: ProfileService;
  let profile: typeof ProfileEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: NodeConfigService, useValue: nodeConfigServiceMock },
        { provide: getModelToken(ProfileEntity), useValue: profileMock },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profile = module.get<typeof ProfileEntity>(getModelToken(ProfileEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call profile.findAll with arguments when call find method', async () => {
    // Arrange
    const args = { filter: { id: 1 } };
    const expectedArgs = {
      limit: 200,
      offset: 0,
      where: {
        ...args.filter,
      },
      attributes: {
        exclude: ['userId'],
      },
      include: [UserEntity],
    };

    // Act
    await service.find(args);

    // Assert
    expect(profile.findAll).toHaveBeenCalledTimes(1);
    expect(profile.findAll).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call profile.findByPk with arguments when call findById method', async () => {
    // Arrange
    const id = 'abc-def-ghi';

    // Act
    await service.findById(id);

    // Assert
    expect(profile.findByPk).toHaveBeenCalledTimes(1);
    expect(profile.findByPk).toHaveBeenCalledWith(id);
  });

  it('should return a null value when call findById method and any profile was found', async () => {
    // Arrange
    const id = 'abc-def-ghi';
    jest
      .spyOn(profile, 'findByPk')
      .mockImplementationOnce(() => Promise.resolve(null));

    // Act
    const result = await service.findById(id);

    // Assert
    expect(result).toBeNull();
    expect(profile.findByPk).toHaveBeenCalledTimes(1);
    expect(profile.findByPk).toHaveBeenCalledWith(id);
  });

  it('should call profile.count with arguments when call count method', async () => {
    // Arrange
    const args = { filter: { lastName: 'Doe' } };
    const expectedArgs = { where: { lastName: 'Doe' } };

    // Act
    await service.count(args as any);

    // Assert
    expect(profile.count).toHaveBeenCalledTimes(1);
    expect(profile.count).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call profile.create with arguments when call create method', async () => {
    // Arrange
    const data: CreateProfileDto = {
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempor efficitur eros ut vulputate. Nam hendrerit ultrices interdum. Pellentesque ut lacinia lacus. Vestibulum rhoncus lectus velit, quis maximus tellus posuere.',
      firstName: 'John',
      lastName: 'Doe',
    };
    const user = { id: 'abcd-efgh-ijkl-mnop' };
    const expectedArgs = { ...data, userId: user.id };

    // Act
    await service.create(data, user);

    // Assert
    expect(profile.create).toHaveBeenCalledTimes(1);
    expect(profile.create).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call save instance method with arguments and update all profile data when call overwrite method', async () => {
    // Arrange
    const id = 'abc-def-ghi';
    const oldProfile = {
      id: 'xlmn-opqrs-tuvw-xyab',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean finibus faucibus mauris porta rutrum. Nam eu cursus urna. Aliquam at porttitor purus, ac ultrices eros. Sed consectetur orci fringilla, fermentum.',
      firstName: 'John',
      lastName: 'Doe',
      userId: id,
      createdAt: '12/12/12T10:30:23',
      updatedAt: '12/12/12T10:30:23',
      save: jest.fn(),
    };
    const data: UpdateProfileDto = {
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In metus massa, tincidunt vitae lorem eget, convallis luctus felis. Vivamus tempus risus eu tempus ultricies. Phasellus pretium mauris a tempus cursus.',
      firstName: 'Alice',
      lastName: 'Smith',
    };
    jest.spyOn(service, 'findById');
    (profile.findByPk as any).mockReturnValue(oldProfile);

    // Act
    await service.overwrite(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldProfile.bio).toBe(data.bio);
    expect(oldProfile.firstName).toBe(data.firstName);
    expect(oldProfile.lastName).toBe(data.lastName);
    expect(oldProfile.save).toHaveBeenCalledTimes(1);
    expect(oldProfile.save).toHaveBeenCalledWith();
  });

  it('should call save instance method with arguments and update properties of the profile when call update method', async () => {
    // Arrange
    const id = 'abc-def-ghi';
    const bio =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean finibus faucibus mauris porta rutrum. Nam eu cursus urna. Aliquam at porttitor purus, ac ultrices eros. Sed consectetur orci fringilla, fermentum.';
    const firstName = 'John';
    const oldProfile = {
      id: 'xlmn-opqrs-tuvw-xyab',
      bio,
      firstName,
      lastName: 'Doe',
      userId: id,
      createdAt: '12/12/12T10:30:23',
      updatedAt: '12/12/12T10:30:23',
      save: jest.fn(),
    };
    const data: PatchProfileDto = {
      lastName: 'Smith',
    };
    jest.spyOn(service, 'findById');
    (profile.findByPk as any).mockReturnValue(oldProfile);

    // Act
    await service.update(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldProfile.bio).toBe(bio);
    expect(oldProfile.firstName).toBe(firstName);
    expect(oldProfile.lastName).toBe(data.lastName);
    expect(oldProfile.save).toHaveBeenCalledTimes(1);
    expect(oldProfile.save).toHaveBeenCalledWith();
  });

  it('should not update data on the profile instance when any data is sent to update method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const bio =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean finibus faucibus mauris porta rutrum. Nam eu cursus urna. Aliquam at porttitor purus, ac ultrices eros. Sed consectetur orci fringilla, fermentum.';
    const firstName = 'John';
    const lastName = 'Doe';
    const oldProfile = {
      id: 'xlmn-opqrs-tuvw-xyab',
      bio,
      firstName,
      lastName,
      userId: id,
      createdAt: '12/12/12T10:30:23',
      updatedAt: '12/12/12T10:30:23',
      save: jest.fn(),
    };
    const data: PatchProfileDto = {};
    jest.spyOn(service, 'findById');
    (profile.findByPk as any).mockReturnValue(oldProfile);

    // Act
    await service.update(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldProfile.bio).toBe(bio);
    expect(oldProfile.firstName).toBe(firstName);
    expect(oldProfile.lastName).toBe(lastName);
    expect(oldProfile.save).toHaveBeenCalledTimes(1);
    expect(oldProfile.save).toHaveBeenCalledWith();
  });

  it('should call profile.destroy when call remove method', async () => {
    // Arrange
    const id = 'abc-def-ghi';
    const oldProfile = {
      id: 'xlmn-opqrs-tuvw-xyab',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean finibus faucibus mauris porta rutrum. Nam eu cursus urna. Aliquam at porttitor purus, ac ultrices eros. Sed consectetur orci fringilla, fermentum.',
      firstName: 'John',
      lastName: 'Doe',
      userId: id,
      createdAt: '12/12/12T10:30:23',
      updatedAt: '12/12/12T10:30:23',
      save: jest.fn(),
    };
    jest.spyOn(service, 'findById');
    (profile.findByPk as any).mockReturnValue(oldProfile);
    const expectedArgs = { where: { id } };

    // Act
    await service.remove(id);

    // Assert
    expect(profile.destroy).toHaveBeenCalledTimes(1);
    expect(profile.destroy).toHaveBeenCalledWith(expectedArgs);
  });
});
