import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { PostEntity, ProfileEntity, UserEntity } from '../../models';
import { BcryptService } from '../../shared/services/bcrypt.service';
import { NodeConfigService } from '../../shared/services/node-config.service';
import { UserRole } from '../constants/user.constant';
import { CreateUserDto } from '../dto/create-user.dto';
import { PatchUserDto } from '../dto/patch-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserWithoutPassword } from '../types/user-types.type';
import { UserService } from './user.service';

const userMock = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
};

const bcryptServiceMock = {
  hashPassword: jest.fn((arg) => arg.split('').reverse().join('')),
};

const nodeConfigServiceMock = {
  config: {
    get: jest.fn(() => 200),
  },
};

describe('UserService', () => {
  let service: UserService;
  let bcrypt: BcryptService;
  let user: typeof UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(UserEntity), useValue: userMock },
        { provide: BcryptService, useValue: bcryptServiceMock },
        { provide: NodeConfigService, useValue: nodeConfigServiceMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    bcrypt = module.get<BcryptService>(BcryptService);
    user = module.get<typeof UserEntity>(getModelToken(UserEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call user.findAll with arguments when call find method', async () => {
    // Arrange
    const args = { filter: { id: 1 } };
    const expectedArgs = {
      limit: 200,
      offset: 0,
      where: { ...args.filter },
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
    };

    // Act
    await service.find(args);

    // Assert
    expect(user.findAll).toHaveBeenCalledTimes(1);
    expect(user.findAll).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call user.findByPk with arguments when call findById method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';

    // Act
    await service.findById(id);

    // Assert
    expect(user.findByPk).toHaveBeenCalledTimes(1);
    expect(user.findByPk).toHaveBeenCalledWith(id);
  });

  it('should return NULL when any user was found', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    jest
      .spyOn(user, 'findByPk')
      .mockImplementationOnce(() => Promise.resolve(null));

    // Act
    const result = await service.findById(id);

    // Assert
    expect(result).toBeNull();
    expect(user.findByPk).toHaveBeenCalledTimes(1);
    expect(user.findByPk).toHaveBeenCalledWith(id);
  });

  it('should call user.findOne with args when call findOne method', async () => {
    // Arrange
    const data: UserWithoutPassword = {
      username: 'test',
      email: 'test@test.com',
    };
    const expectedArgs = {
      where: { ...data },
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
    };

    // Act
    service.findOne(data);

    // Assert
    expect(user.findOne).toHaveBeenCalledTimes(1);
    expect(user.findOne).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call user.count with arguments when call count method', async () => {
    // Arrange
    const args = { filter: { username: 'John' } };
    const expectedArgs = { where: { ...args.filter } };

    // Act
    await service.count(args as any);

    // Assert
    expect(user.count).toHaveBeenCalledTimes(1);
    expect(user.count).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call prisma user.create with arguments when call create method', async () => {
    // Arrange
    const userData: CreateUserDto = {
      email: 'test@test.com',
      password: 'secret',
      username: 'funnyName',
    };
    const expectedArgs = {
      ...userData,
      password: userData.password.split('').reverse().join(''),
      role: UserRole.USER,
    };

    // Act
    await service.create(userData);

    // Assert
    expect(bcrypt.hashPassword).toHaveBeenCalledTimes(1);
    expect(bcrypt.hashPassword).toHaveBeenCalledWith(userData.password);
    expect(user.create).toHaveBeenCalledTimes(1);
    expect(user.create).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call save instance method with arguments and update all user data when call overwrite method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const oldUser = {
      id,
      email: 'old@test.com',
      password: 'oldSecret',
      username: 'oldFunnyName',
      createdAt: '12/12/12T10:30:23',
      updatedAt: '12/12/12T10:30:23',
      save: jest.fn(),
    };
    const userData: UpdateUserDto = {
      email: 'test@test.com',
      password: 'newSecret',
      username: 'funnyName',
    };
    (user.findByPk as any).mockReturnValue(oldUser);

    // Act
    await service.overwrite(id, userData);

    // Assert
    expect(oldUser.email).toBe(userData.email);
    expect(oldUser.username).toBe(userData.username);
    expect(oldUser.password).toBe(
      userData.password.split('').reverse().join(''),
    );
    expect(oldUser.save).toHaveBeenCalledTimes(1);
    expect(oldUser.save).toHaveBeenCalledWith();
  });

  it('should call save instance method with arguments and update the passed properties of the user data when call update method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const password = 'oldSecret';
    const username = 'oldFunnyName';
    const oldUser = {
      id,
      email: 'old@test.com',
      password,
      username,
      createdAt: '12/12/12T10:30:23',
      updatedAt: '12/12/12T10:30:23',
      save: jest.fn(),
    };
    const userData: PatchUserDto = {
      email: 'test@test.com',
    };
    jest.spyOn(service, 'findById');
    (user.findByPk as any).mockReturnValue(oldUser);

    // Act
    await service.update(id, userData);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldUser.email).toBe(userData.email);
    expect(oldUser.username).toBe(username);
    expect(oldUser.password).toBe(password);
    expect(oldUser.save).toHaveBeenCalledTimes(1);
    expect(oldUser.save).toHaveBeenCalledWith();
  });

  it('should call save instance method with arguments and not update the user data when call update method with empty data', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const email = 'old@test.com';
    const password = 'oldSecret';
    const username = 'oldFunnyName';
    const oldUser = {
      id,
      email,
      password,
      username,
      createdAt: '12/12/12T10:30:23',
      updatedAt: '12/12/12T10:30:23',
      save: jest.fn(),
    };
    const userData: PatchUserDto = {
      email: '',
    };
    jest.spyOn(service, 'findById');
    (user.findByPk as any).mockReturnValue(oldUser);

    // Act
    await service.update(id, userData);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldUser.email).toBe(email);
    expect(oldUser.username).toBe(username);
    expect(oldUser.password).toBe(password);
    expect(oldUser.save).toHaveBeenCalledTimes(1);
    expect(oldUser.save).toHaveBeenCalledWith();
  });

  it('should call user.destroy with arguments when call remove method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const oldUser = {
      id,
      email: 'old@test.com',
      password: 'oldSecret',
      username: 'oldFunnyName',
      createdAt: '12/12/12T10:30:23',
      updatedAt: '12/12/12T10:30:23',
    };
    const expectedArgs = { where: { id } };
    jest.spyOn(service, 'findById');
    (user.findByPk as any).mockReturnValue(oldUser);

    // Act
    await service.remove(id);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(user.destroy).toHaveBeenCalledTimes(1);
    expect(user.destroy).toHaveBeenCalledWith(expectedArgs);
  });
});
