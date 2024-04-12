import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards';
import { CategoryEntity } from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import {
  CollectionResponse,
  CountResponse,
  DeleteResponse,
  EntityResponse,
} from '../../shared/responses';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { PatchCategoryDto } from '../dto/patch-category.dto';
import { CategoryService } from '../services/category.service';

@ApiTags('Categories controller')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOkResponse({
    type: () => CollectionResponse<CategoryEntity[]>,
    description: 'A list of categories',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get()
  public async find(
    @Query() query?: IAppQueryString,
  ): Promise<CollectionResponse<CategoryEntity[]>> {
    const categories = await this.categoryService.find(query);

    return {
      data: {
        items: categories.map((category) => category.toJSON()),
      },
    };
  }

  @ApiFoundResponse({
    type: () => EntityResponse<CategoryEntity>,
    description: 'A found category',
  })
  @ApiNotFoundResponse({ description: 'Any category was found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<EntityResponse<CategoryEntity>> {
    const category = await this.categoryService.findById(id);

    if (!category) {
      throw new NotFoundException('category_exception_not_found');
    }

    return { data: { item: category.toJSON() } };
  }

  @ApiOkResponse({
    type: () => CountResponse,
    description: 'A sum of all categories in the system',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get('count')
  async count(
    @Query()
    query?: IAppQueryString,
  ): Promise<CountResponse> {
    const { count } = await this.categoryService.count(query);

    return { data: { count } };
  }

  @ApiCreatedResponse({
    type: () => EntityResponse<CategoryEntity>,
    description: 'The category was created successfully',
  })
  @ApiConflictResponse({
    description: 'A previous category was found with the same main constraints',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Body() categoryData: CreateCategoryDto,
  ): Promise<EntityResponse<CategoryEntity>> {
    const newCategory = await this.categoryService.create(categoryData);

    return { data: { item: newCategory.toJSON() } };
  }

  @ApiOkResponse({
    type: () => EntityResponse<CategoryEntity>,
    description: 'The category was overwrite successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  public async overwrite(
    @Param('id') id: string,
    @Body() categoryData: CreateCategoryDto,
  ): Promise<EntityResponse<CategoryEntity>> {
    const updatedCategory = await this.categoryService.overwrite(
      id,
      categoryData,
    );

    return { data: { item: updatedCategory.toJSON() } };
  }

  @ApiOkResponse({
    type: () => EntityResponse<CategoryEntity>,
    description: 'The category was updated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    categoryData: PatchCategoryDto,
  ): Promise<EntityResponse<CategoryEntity>> {
    const updateCategory = await this.categoryService.update(id, categoryData);

    return { data: { item: updateCategory.toJSON() } };
  }

  @ApiOkResponse({
    type: () => DeleteResponse,
    description: 'The category was overwrite successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResponse> {
    const { deleted } = await this.categoryService.remove(id);

    return { data: { deleted } };
  }
}
