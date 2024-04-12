import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { PostEntity, TagEntity } from '../../models';
import { NodeConfigService } from '../../shared/services/node-config.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CreateTagDto } from '../dto/create-tag.dto';
import { PatchCategoryDto } from '../dto/patch-category.dto';
import { TagService } from './tag.service';

const tagMock = {
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

describe('TagService', () => {
  let service: TagService;
  let tag: typeof TagEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        { provide: getModelToken(TagEntity), useValue: tagMock },
        { provide: NodeConfigService, useValue: nodeConfigServiceMock },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
    tag = module.get<typeof TagEntity>(getModelToken(TagEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call tag.findAll with arguments when call find method', async () => {
    // Arrange
    const args = { filter: { id: 'abcd-efgh-ijkl-mnop' } };
    const expectedArgs = {
      limit: 200,
      offset: 0,
      where: {
        ...args.filter,
      },
      include: [PostEntity],
      order: undefined,
    };

    // Act
    await service.find(args);

    // Assert
    expect(tag.findAll).toHaveBeenCalledTimes(1);
    expect(tag.findAll).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call tag.findByPk with arguments when call findById method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';

    // Act
    await service.findById(id);

    // Assert
    expect(tag.findByPk).toHaveBeenCalledTimes(1);
    expect(tag.findByPk).toHaveBeenCalledWith(id);
  });

  it('should return null when call findById method and any tag was found', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    jest
      .spyOn(tag, 'findByPk')
      .mockImplementationOnce(() => Promise.resolve(null));

    // Act
    const result = await service.findById(id);

    // Assert
    expect(result).toBeNull();
    expect(tag.findByPk).toHaveBeenCalledTimes(1);
    expect(tag.findByPk).toHaveBeenCalledWith(id);
  });

  it('should call tag.count with arguments when call count method', async () => {
    // Arrange
    const args = { filter: { name: 'it' } };
    const expectedArgs = { where: { name: 'it' } };

    // Act
    await service.count(args);

    // Assert
    expect(tag.count).toHaveBeenCalledTimes(1);
    expect(tag.count).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call category.create with arguments when call create method', async () => {
    // Arrange
    const data: CreateTagDto = {
      name: 'test',
    };
    const expectedArgs = { ...data };

    // Act
    await service.create(data);

    // Assert
    expect(tag.create).toHaveBeenCalledTimes(1);
    expect(tag.create).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call save instance method with arguments and update all category data when call overwrite method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const oldCategory = {
      id,
      name: 'test',
      save: jest.fn(),
    };
    const data: CreateTagDto = {
      name: 'test2',
    };
    jest.spyOn(service, 'findById');
    (tag.findByPk as any).mockReturnValue(oldCategory);

    // Act
    await service.overwrite(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldCategory.name).toBe(data.name);
    expect(oldCategory.save).toHaveBeenCalledTimes(1);
    expect(oldCategory.save).toHaveBeenCalledWith();
  });

  it('should not update the category data when call overwrite and any category was found', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const oldTag = {
      id,
      name: 'test',
      save: jest.fn(),
    };
    const data: CreateCategoryDto = {
      name: 'test2',
    };
    jest.spyOn(service, 'findById');
    (tag.findByPk as any).mockReturnValue(null);

    // Act
    await service.overwrite(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldTag.name).not.toBe(data.name);
    expect(oldTag.save).not.toHaveBeenCalled();
  });

  it('should call save instance method with arguments and update properties of the category when call update method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const name = 'test';
    const oldTag = {
      id,
      name,
      save: jest.fn(),
    };
    const data: PatchCategoryDto = {
      name: 'test2',
    };
    jest.spyOn(service, 'findById');
    (tag.findByPk as any).mockReturnValue(oldTag);

    // Act
    await service.update(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldTag.name).toBe(data.name);
    expect(oldTag.save).toHaveBeenCalledTimes(1);
    expect(oldTag.save).toHaveBeenCalledWith();
  });

  it('should not update the category data when call update method with empty data', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const name = 'test';
    const oldTag = {
      id,
      name,
      save: jest.fn(),
    };
    const data: PatchCategoryDto = {
      name: '',
    };
    jest.spyOn(service, 'findById');
    (tag.findByPk as any).mockReturnValue(oldTag);

    // Act
    await service.update(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldTag.name).not.toBe(data.name);
    expect(oldTag.name).toBe(name);
    expect(oldTag.save).toHaveBeenCalledTimes(1);
    expect(oldTag.save).toHaveBeenCalledWith();
  });

  it('should not update the category data when call update method and any category was found', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const name = 'test';
    const oldTag = {
      id,
      name,
      save: jest.fn(),
    };
    const data: PatchCategoryDto = {
      name: '',
    };
    jest.spyOn(service, 'findById');
    (tag.findByPk as any).mockReturnValue(null);

    // Act
    await service.update(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldTag.name).not.toBe(data.name);
    expect(oldTag.name).toBe(name);
    expect(oldTag.save).not.toHaveBeenCalled();
  });

  it('should call category.delete with arguments when call remove method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const expectedArgs = { where: { id } };
    jest.spyOn(service, 'findById');
    (tag.findByPk as any).mockReturnValue({});

    // Act
    await service.remove(id);

    // Assert
    expect(tag.destroy).toHaveBeenCalledTimes(1);
    expect(tag.destroy).toHaveBeenCalledWith(expectedArgs);
  });
});
