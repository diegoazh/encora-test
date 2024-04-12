import { Test, TestingModule } from '@nestjs/testing';
import { mockServiceFactory } from '../../../test/utils/utils';
import { CreateTagDto } from '../dto/create-tag.dto';
import { PatchTagDto } from '../dto/patch-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { TagService } from '../services/tag.service';
import { TagController } from './tag.controller';

describe('TagController', () => {
  let controller: TagController;
  let tagService: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [{ provide: TagService, useFactory: mockServiceFactory }],
    }).compile();

    controller = module.get<TagController>(TagController);
    tagService = module.get<TagService>(TagService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call tagService.find with provided args when receive a GET HTTP request on /tags', async () => {
    // Arrange
    const name = 'Test tag';
    const args = { filter: { title: name } };

    // Act
    await controller.find(args);

    // Assert
    expect(tagService.find).toHaveBeenCalledTimes(1);
    expect(tagService.find).toHaveBeenCalledWith(args);
  });

  it('should call tagService.findById with provided args when receive a GET HTTP request on /tags/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';

    // Act
    await controller.findById(id);

    // Assert
    expect(tagService.findById).toHaveBeenCalledTimes(1);
    expect(tagService.findById).toHaveBeenCalledWith(id);
  });

  it('should call tagService.count with provided args when receive a GET HTTP request on /tags/count', async () => {
    // Arrange
    const args = { where: { published: true } } as any;

    // Act
    await controller.count(args);

    // Assert
    expect(tagService.count).toHaveBeenCalledTimes(1);
    expect(tagService.count).toHaveBeenCalledWith(args);
  });

  it('should call tagService.create with provided args when receive a POST HTTP request on /tags', async () => {
    // Arrange
    const tag: CreateTagDto = {
      name: 'test',
    };

    // Act
    await controller.create(tag);

    // Assert
    expect(tagService.create).toHaveBeenCalledTimes(1);
    expect(tagService.create).toHaveBeenCalledWith(tag);
  });

  it('should call tagService.overwrite with provided args when receive a PUT HTTP request on /tags/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const tag: UpdateTagDto = {
      name: 'test',
    };

    // Act
    await controller.overwrite(id, tag);

    // Assert
    expect(tagService.overwrite).toHaveBeenCalledTimes(1);
    expect(tagService.overwrite).toHaveBeenCalledWith(id, tag);
  });

  it('should call tagService.update with provided args when receive a PATCH HTTP request on /tags/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const tag: PatchTagDto = {
      name: 'test patch',
    };

    // Act
    await controller.update(id, tag);

    // Assert
    expect(tagService.update).toHaveBeenCalledTimes(1);
    expect(tagService.update).toHaveBeenCalledWith(id, tag);
  });

  it('should call tagService.remove with provided args when receive a DELETE HTTP request on /tags/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';

    // Act
    await controller.remove(id);

    // Assert
    expect(tagService.remove).toHaveBeenCalledTimes(1);
    expect(tagService.remove).toHaveBeenCalledWith(id);
  });
});
