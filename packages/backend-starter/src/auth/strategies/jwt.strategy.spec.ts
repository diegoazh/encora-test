import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

const configServiceMock = {
  get(): string {
    return 'abcdefghijklmnopqrstuvwxyz';
  },
};

describe('JwtStrategy', () => {
  let service: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a jwt decrypted token when a user send', async () => {
    // Arrange
    const payload = {
      sub: 'abcd-efgh-ijkl',
      username: 'test',
      email: 'test@test.com',
    };
    const expectedResult = {
      userid: payload.sub,
      username: payload.username,
      email: payload.email,
    };

    // Act
    const result = await service.validate(payload);

    // Assert
    expect(result).toEqual(expectedResult);
  });
});
