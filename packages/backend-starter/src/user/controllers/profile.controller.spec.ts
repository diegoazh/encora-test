import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type';
import { mockServiceFactory } from '../../../test/utils/utils';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { PatchProfileDto } from '../dto/patch-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileService } from '../services/profile.service';
import { ProfileController } from './profile.controller';

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [{ provide: ProfileService, useFactory: mockServiceFactory }],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call profileService.find with provided args when receive a GET HTTP request on /profiles', async () => {
    // Arrange
    const lastName = 'Doe';
    const args = { filter: { lastName } };

    // Act
    await controller.find(args);

    // Assert
    expect(profileService.find).toHaveBeenCalledTimes(1);
    expect(profileService.find).toHaveBeenCalledWith(args);
  });

  it('should call profileService.findById with provided args when receive a GET HTTP request on /profiles/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';

    // Act
    await controller.findById(id);

    // Assert
    expect(profileService.findById).toHaveBeenCalledTimes(1);
    expect(profileService.findById).toHaveBeenCalledWith(id);
  });

  it('should call profileService.count with provided args when receive a GET HTTP request on /profiles/count', async () => {
    // Arrange
    const args = { filter: { firstName: 'Alice' } };

    // Act
    await controller.count(args as any);

    // Assert
    expect(profileService.count).toHaveBeenCalledTimes(1);
    expect(profileService.count).toHaveBeenCalledWith(args);
  });

  it('should call profileService.create with provided args when receive a POST HTTP request on /profiles', async () => {
    // Arrange
    const req = {
      user: { id: 'abcd-efgh-ijkl-mnop' },
    } as unknown as AuthenticatedRequest;
    const profile: CreateProfileDto = {
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempor efficitur eros ut vulputate. Nam hendrerit ultrices interdum. Pellentesque ut lacinia lacus. Vestibulum rhoncus lectus velit, quis maximus tellus posuere.',
      firstName: 'John',
      lastName: 'Doe',
    };

    // Act
    await controller.create(profile, req);

    // Assert
    expect(profileService.create).toHaveBeenCalledTimes(1);
    expect(profileService.create).toHaveBeenCalledWith(profile, req.user);
  });

  it('should call profileService.update with provided args when receive a PUT HTTP request on /profiles/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const profile: UpdateProfileDto = {
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In metus massa, tincidunt vitae lorem eget, convallis luctus felis. Vivamus tempus risus eu tempus ultricies. Phasellus pretium mauris a tempus cursus.',
      firstName: 'Alice',
      lastName: 'Smith',
    };

    // Act
    await controller.overwrite(id, profile);

    // Assert
    expect(profileService.overwrite).toHaveBeenCalledTimes(1);
    expect(profileService.overwrite).toHaveBeenCalledWith(id, profile);
  });

  it('should call profileService.partialUpdate with provided args when receive a PATCH HTTP request on /profiles/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const profile: PatchProfileDto = {
      lastName: 'Smith',
    };

    // Act
    await controller.update(id, profile);

    // Assert
    expect(profileService.update).toHaveBeenCalledTimes(1);
    expect(profileService.update).toHaveBeenCalledWith(id, profile);
  });

  it('should call profileService.remove with provided args when receive a DELETE HTTP request on /profiles/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';

    // Act
    await controller.remove(id);

    // Assert
    expect(profileService.remove).toHaveBeenCalledTimes(1);
    expect(profileService.remove).toHaveBeenCalledWith(id);
  });
});
