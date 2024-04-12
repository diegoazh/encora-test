import { Test, TestingModule } from '@nestjs/testing';
import { mockServiceFactory } from '../../../test/utils/utils';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { PatchCategoryDto } from '../dto/patch-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryService } from '../services/category.service';
import { CategoryController } from './category.controller';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [{ provide: CategoryService, useFactory: mockServiceFactory }],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call categoryService.find with provided args when receive a GET HTTP request on /categories', async () => {
    // Arrange
    const name = 'Test category';
    const args = { filter: { title: name } };

    // Act
    await controller.find(args);

    // Assert
    expect(categoryService.find).toHaveBeenCalledTimes(1);
    expect(categoryService.find).toHaveBeenCalledWith(args);
  });

  it('should call categoryService.findById with provided args when receive a GET HTTP request on /categories/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';

    // Act
    await controller.findById(id);

    // Assert
    expect(categoryService.findById).toHaveBeenCalledTimes(1);
    expect(categoryService.findById).toHaveBeenCalledWith(id);
  });

  it('should call categoryService.count with provided args when receive a GET HTTP request on /categories/count', async () => {
    // Arrange
    const args = { where: { published: true } } as any;

    // Act
    await controller.count(args);

    // Assert
    expect(categoryService.count).toHaveBeenCalledTimes(1);
    expect(categoryService.count).toHaveBeenCalledWith(args);
  });

  it('should call categoryService.create with provided args when receive a POST HTTP request on /categories', async () => {
    // Arrange
    const category: CreateCategoryDto = {
      name: 'test',
    };

    // Act
    await controller.create(category);

    // Assert
    expect(categoryService.create).toHaveBeenCalledTimes(1);
    expect(categoryService.create).toHaveBeenCalledWith(category);
  });

  it('should call categoryService.overwrite with provided args when receive a PUT HTTP request on /categories/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const category: UpdateCategoryDto = {
      name: 'test',
    };

    // Act
    await controller.overwrite(id, category);

    // Assert
    expect(categoryService.overwrite).toHaveBeenCalledTimes(1);
    expect(categoryService.overwrite).toHaveBeenCalledWith(id, category);
  });

  it('should call categoryService.update with provided args when receive a PATCH HTTP request on /categories/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const category: PatchCategoryDto = {
      name: 'test patch',
    };

    // Act
    await controller.update(id, category);

    // Assert
    expect(categoryService.update).toHaveBeenCalledTimes(1);
    expect(categoryService.update).toHaveBeenCalledWith(id, category);
  });

  it('should call categoryService.remove with provided args when receive a DELETE HTTP request on /categories/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';

    // Act
    await controller.remove(id);

    // Assert
    expect(categoryService.remove).toHaveBeenCalledTimes(1);
    expect(categoryService.remove).toHaveBeenCalledWith(id);
  });
});
