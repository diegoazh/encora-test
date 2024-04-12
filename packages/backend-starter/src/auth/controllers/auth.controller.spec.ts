import { Test, TestingModule } from '@nestjs/testing';
import {
  authServiceMockFactory,
  mockServiceFactory,
} from '../../../test/utils/utils';
import { CreateUserDto } from '../../user/dto';
import { UserService } from '../../user/services/user.service';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('Auth Controller', () => {
  let controller: AuthController;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: UserService, useFactory: mockServiceFactory },
        { provide: AuthService, useFactory: authServiceMockFactory },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call authService.login when a user is logged in', async () => {
    // Arrange
    const credentials = { email: 'test@test.com', password: '123456' };
    const request = {
      user: { email: 'test@test.com', password: '123456', username: 'test' },
    };
    const expectedResult = { access_token: 'abcdefghi' };

    // Act
    const result = controller.login(credentials, request as any);

    // Assert
    expect(result).toEqual(expectedResult);
    expect(authService.login).toHaveBeenCalledTimes(1);
    expect(authService.login).toHaveBeenCalledWith(request.user);
  });

  it('should call userService.create with provided args when receive a POST HTTP request on /users', async () => {
    // Arrange
    const user: CreateUserDto = {
      email: 'test@test.com',
      password: 'secret',
      username: 'funnyName',
    };

    // Act
    await controller.create(user);

    // Assert
    expect(userService.create).toHaveBeenCalledTimes(1);
    expect(userService.create).toHaveBeenCalledWith(user);
  });
});
