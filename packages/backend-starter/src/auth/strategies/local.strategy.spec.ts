import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { LocalStrategy } from './local.strategy';

const authServiceMock = {
  validateUser: jest.fn(() => Promise.resolve({})),
};

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user when its credentials were correct', async () => {
    // Arrange
    const data = {
      email: 'test@test.com',
      password: 'superSecretAtAll',
    };
    const expectedResult = {};

    // Act
    const result = await localStrategy.validate(data.email, data.password);

    // Assert
    expect(authService.validateUser).toHaveBeenCalledTimes(1);
    expect(authService.validateUser).toHaveBeenCalledWith(data);
    expect(result).toEqual(expectedResult);
  });

  it('should throw an unauthorized exception when user credentials are incorrect', async () => {
    // Arrange
    let errorThrown;
    const data = {
      email: 'test@test.com',
      password: 'superSecretAtAll',
    };
    jest
      .spyOn(authServiceMock, 'validateUser')
      .mockImplementationOnce(() => Promise.resolve(null));

    // Act
    try {
      await localStrategy.validate(data.email, data.password);
    } catch (error) {
      errorThrown = error;
    }

    // Assert
    expect(authService.validateUser).toHaveBeenCalledTimes(1);
    expect(authService.validateUser).toHaveBeenCalledWith(data);
    expect(errorThrown).toBeInstanceOf(UnauthorizedException);
  });
});
