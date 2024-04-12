import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryEntity, PostEntity } from '../../models';
import { NodeConfigService } from '../../shared/services/node-config.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { PatchCategoryDto } from '../dto/patch-category.dto';
import { CategoryService } from './category.service';

const categoryMock = {
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

describe('CategoryService', () => {
  let service: CategoryService;
  let category: typeof CategoryEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: getModelToken(CategoryEntity), useValue: categoryMock },
        { provide: NodeConfigService, useValue: nodeConfigServiceMock },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    category = module.get<typeof CategoryEntity>(getModelToken(CategoryEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call category.findAll with arguments when call find method', async () => {
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
    expect(category.findAll).toHaveBeenCalledTimes(1);
    expect(category.findAll).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call category.findByPk with arguments when call findById method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';

    // Act
    await service.findById(id);

    // Assert
    expect(category.findByPk).toHaveBeenCalledTimes(1);
    expect(category.findByPk).toHaveBeenCalledWith(id);
  });

  it('should return null when call findById method and any category was found', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    jest
      .spyOn(category, 'findByPk')
      .mockImplementationOnce(() => Promise.resolve(null));

    // Act
    const result = await service.findById(id);

    // Assert
    expect(result).toBeNull();
    expect(category.findByPk).toHaveBeenCalledTimes(1);
    expect(category.findByPk).toHaveBeenCalledWith(id);
  });

  it('should call category.count with arguments when call count method', async () => {
    // Arrange
    const args = { filter: { name: 'it' } };
    const expectedArgs = { where: { name: 'it' } };

    // Act
    await service.count(args);

    // Assert
    expect(category.count).toHaveBeenCalledTimes(1);
    expect(category.count).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call category.create with arguments when call create method', async () => {
    // Arrange
    const data: CreateCategoryDto = {
      name: 'test',
    };
    const expectedArgs = { ...data };

    // Act
    await service.create(data);

    // Assert
    expect(category.create).toHaveBeenCalledTimes(1);
    expect(category.create).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call save instance method with arguments and update all category data when call overwrite method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const oldCategory = {
      id,
      name: 'test',
      save: jest.fn(),
    };
    const data: CreateCategoryDto = {
      name: 'test2',
    };
    jest.spyOn(service, 'findById');
    (category.findByPk as any).mockReturnValue(oldCategory);

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
    const oldCategory = {
      id,
      name: 'test',
      save: jest.fn(),
    };
    const data: CreateCategoryDto = {
      name: 'test2',
    };
    jest.spyOn(service, 'findById');
    (category.findByPk as any).mockReturnValue(null);

    // Act
    await service.overwrite(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldCategory.name).not.toBe(data.name);
    expect(oldCategory.save).not.toHaveBeenCalled();
  });

  it('should call save instance method with arguments and update properties of the category when call update method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const name = 'test';
    const oldCategory = {
      id,
      name,
      save: jest.fn(),
    };
    const data: PatchCategoryDto = {
      name: 'test2',
    };
    jest.spyOn(service, 'findById');
    (category.findByPk as any).mockReturnValue(oldCategory);

    // Act
    await service.update(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldCategory.name).toBe(data.name);
    expect(oldCategory.save).toHaveBeenCalledTimes(1);
    expect(oldCategory.save).toHaveBeenCalledWith();
  });

  it('should not update the category data when call update method with empty data', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const name = 'test';
    const oldCategory = {
      id,
      name,
      save: jest.fn(),
    };
    const data: PatchCategoryDto = {
      name: '',
    };
    jest.spyOn(service, 'findById');
    (category.findByPk as any).mockReturnValue(oldCategory);

    // Act
    await service.update(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldCategory.name).not.toBe(data.name);
    expect(oldCategory.name).toBe(name);
    expect(oldCategory.save).toHaveBeenCalledTimes(1);
    expect(oldCategory.save).toHaveBeenCalledWith();
  });

  it('should not update the category data when call update method and any category was found', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const name = 'test';
    const oldCategory = {
      id,
      name,
      save: jest.fn(),
    };
    const data: PatchCategoryDto = {
      name: '',
    };
    jest.spyOn(service, 'findById');
    (category.findByPk as any).mockReturnValue(null);

    // Act
    await service.update(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldCategory.name).not.toBe(data.name);
    expect(oldCategory.name).toBe(name);
    expect(oldCategory.save).not.toHaveBeenCalled();
  });

  it('should call category.delete with arguments when call remove method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const expectedArgs = { where: { id } };
    jest.spyOn(service, 'findById');
    (category.findByPk as any).mockReturnValue({});

    // Act
    await service.remove(id);

    // Assert
    expect(category.destroy).toHaveBeenCalledTimes(1);
    expect(category.destroy).toHaveBeenCalledWith(expectedArgs);
  });
});
