import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../../models';
import { BcryptService } from '../../shared/services/bcrypt.service';
import { UserRole } from '../../user/constants/user.constant';
import { UserService } from '../../user/services/user.service';
import { AuthService } from './auth.service';

const jwtServiceMock = {
  sign: jest.fn(() => 'abcdefghijklmnopqrstuvwxyz'),
};
const usersServiceMock = {
  findOne: jest.fn(() => ({})),
};
const bcryptServiceMock = {
  checkPassword: jest.fn(() => true),
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UserService;
  let bcryptService: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: usersServiceMock },
        { provide: BcryptService, useValue: bcryptServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UserService>(UserService);
    bcryptService = module.get<BcryptService>(BcryptService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user when its credentials was validated successfully', async () => {
    // Arrange
    const savedUser: Partial<UserEntity> = {
      email: 'test@test.com',
      password: 'superSecretAtAll',
      username: 'test',
      role: UserRole.USER,
      id: 'abcd-efgh-ijkl-mnop',
    };
    const data = {
      username: savedUser.username,
      email: savedUser.email,
      password: savedUser.password,
    };
    jest
      .spyOn(usersServiceMock, 'findOne')
      .mockImplementationOnce(() => Promise.resolve(savedUser));
    const { password, ...expectedResult } = savedUser;
    const { password: password2, ...expectedFindOneArgs } = data;

    // Act
    const result = await service.validateUser(data);

    // Assert
    expect(usersService.findOne).toHaveBeenCalledTimes(1);
    expect(usersService.findOne).toHaveBeenCalledWith(expectedFindOneArgs);
    expect(bcryptService.checkPassword).toHaveBeenCalledTimes(1);
    expect(bcryptService.checkPassword).toHaveBeenCalledWith(
      data.password,
      savedUser.password,
    );
    expect(result).toEqual(expectedResult);
  });

  it('should return null when its credentials was validated unsuccessfully', async () => {
    // Arrange
    const savedUser: Partial<UserEntity> = {
      email: 'test@test.com',
      password: 'superSecretAtAll',
      username: 'test',
      role: UserRole.USER,
      id: 'abcd-efgh-ijkl-mnop',
    };
    const data = {
      username: savedUser.username,
      email: savedUser.email,
      password: 'different',
    };
    jest
      .spyOn(usersServiceMock, 'findOne')
      .mockImplementationOnce(() => Promise.resolve(savedUser));
    jest
      .spyOn(bcryptServiceMock, 'checkPassword')
      .mockImplementationOnce(() => false);
    const { password: password2, ...expectedFindOneArgs } = data;

    // Act
    const result = await service.validateUser(data);

    // Assert
    expect(usersService.findOne).toHaveBeenCalledTimes(1);
    expect(usersService.findOne).toHaveBeenCalledWith(expectedFindOneArgs);
    expect(bcryptService.checkPassword).toHaveBeenCalledTimes(1);
    expect(bcryptService.checkPassword).toHaveBeenCalledWith(
      data.password,
      savedUser.password,
    );
    expect(result).toBeNull();
  });

  it('should return an access_token when a user logged in', () => {
    // Arrange
    const user = {
      username: 'test',
      id: 'abcd-efgh-ijkl',
      email: 'test@test.com',
    };
    const expectedPayload = {
      username: user.username,
      sub: user.id,
      email: user.email,
    };
    const expectedResult = { access_token: 'abcdefghijklmnopqrstuvwxyz' };

    // Act
    const result = service.login(user);

    // Assert
    expect(jwtService.sign).toHaveBeenCalledTimes(1);
    expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload);
    expect(result).toEqual(expectedResult);
  });
});
