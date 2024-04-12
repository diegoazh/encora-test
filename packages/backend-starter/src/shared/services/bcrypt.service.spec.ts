import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcryptjs';
import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let service: BcryptService;
  const salt = 'abcdef';

  beforeEach(async () => {
    jest.mock('bcryptjs');
    jest.spyOn(bcrypt, 'genSaltSync').mockReturnValue(salt);

    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call bcrypt.hashSync when is called', () => {
    // Arrange
    const password = 'secret';
    jest.spyOn(bcrypt, 'hashSync').mockImplementationOnce(() => 'abcdef');

    // Act
    service.hashPassword(password);

    // Assert
    expect(bcrypt.hashSync).toHaveBeenCalledTimes(1);
    expect(bcrypt.hashSync).toHaveBeenCalledWith(password, salt);
  });

  it('should call bcrypt.compareSync when is called', () => {
    // Arrange
    const password = 'secret';
    const hash = 'abcd-efgh-ijkl-mnop';
    jest.spyOn(bcrypt, 'compareSync').mockImplementationOnce(() => 'abcdef');

    // Act
    service.checkPassword(password, hash);

    // Assert
    expect(bcrypt.compareSync).toHaveBeenCalledTimes(1);
    expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hash);
  });
});
