import { Test, TestingModule } from '@nestjs/testing';
import { mockServiceFactory } from '../../../test/utils/utils';
import { PatchUserDto } from '../dto/patch-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useFactory: mockServiceFactory }],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call userService.find with provided args when receive a GET HTTP request on /users', async () => {
    // Arrange
    const username = 'john';
    const args = { filter: { username } };

    // Act
    await controller.find(args);

    // Assert
    expect(userService.find).toHaveBeenCalledTimes(1);
    expect(userService.find).toHaveBeenCalledWith(args);
  });

  it('should call userService.findById with provided args when receive a GET HTTP request on /users/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';

    // Act
    await controller.findById(id);

    // Assert
    expect(userService.findById).toHaveBeenCalledTimes(1);
    expect(userService.findById).toHaveBeenCalledWith(id);
  });

  it('should call userService.count with provided args when receive a GET HTTP request on /users/count', async () => {
    // Arrange
    const args = { filter: { username: 'Alice' } } as any;

    // Act
    await controller.count(args);

    // Assert
    expect(userService.count).toHaveBeenCalledTimes(1);
    expect(userService.count).toHaveBeenCalledWith(args);
  });

  it('should call userService.update with provided args when receive a PUT HTTP request on /users/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const user: UpdateUserDto = {
      email: 'test@test.com',
      password: 'newSecret',
      username: 'funnyName',
    };

    // Act
    await controller.overwrite(id, user);

    // Assert
    expect(userService.overwrite).toHaveBeenCalledTimes(1);
    expect(userService.overwrite).toHaveBeenCalledWith(id, user);
  });

  it('should call userService.partialUpdate with provided args when receive a PATCH HTTP request on /users/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const user: PatchUserDto = {
      email: 'test@test.com',
    };

    // Act
    await controller.update(id, user);

    // Assert
    expect(userService.update).toHaveBeenCalledTimes(1);
    expect(userService.update).toHaveBeenCalledWith(id, user);
  });

  it('should call userService.remove with provided args when receive a DELETE HTTP request on /users/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';

    // Act
    await controller.remove(id);

    // Assert
    expect(userService.remove).toHaveBeenCalledTimes(1);
    expect(userService.remove).toHaveBeenCalledWith(id);
  });
});
