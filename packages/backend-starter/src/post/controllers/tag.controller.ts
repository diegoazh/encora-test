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
import { TagEntity } from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import {
  CollectionResponse,
  CountResponse,
  DeleteResponse,
  EntityResponse,
} from '../../shared/responses';
import { CreateTagDto } from '../dto/create-tag.dto';
import { PatchTagDto } from '../dto/patch-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { TagService } from '../services/tag.service';

@ApiTags('Tags controller')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOkResponse({
    type: () => CollectionResponse<TagEntity[]>,
    description: 'A list of tags',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get()
  public async find(
    @Query() query?: IAppQueryString,
  ): Promise<CollectionResponse<TagEntity[]>> {
    const tags = await this.tagService.find(query);

    return {
      data: {
        items: tags.map((tag) => tag.toJSON()),
      },
    };
  }

  @ApiFoundResponse({
    type: () => EntityResponse<TagEntity>,
    description: 'A found tag',
  })
  @ApiNotFoundResponse({ description: 'Any tag was found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<EntityResponse<TagEntity>> {
    const tag = await this.tagService.findById(id);

    if (!tag) {
      throw new NotFoundException('tag_exception_not_found');
    }

    return { data: { item: tag.toJSON() } };
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
    const { count } = await this.tagService.count(query);

    return { data: { count } };
  }

  @ApiCreatedResponse({
    type: () => EntityResponse<TagEntity>,
    description: 'The tag was created successfully',
  })
  @ApiConflictResponse({
    description: 'A previous tag was found with the same main constraints',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Body() tagData: CreateTagDto,
  ): Promise<EntityResponse<TagEntity>> {
    const newTag = await this.tagService.create(tagData);

    return { data: { item: newTag.toJSON() } };
  }

  @ApiOkResponse({
    type: () => EntityResponse<TagEntity>,
    description: 'The tag was overwrite successfully',
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
    @Body() tagData: UpdateTagDto,
  ): Promise<EntityResponse<TagEntity>> {
    const updatedTag = await this.tagService.overwrite(id, tagData);

    return { data: { item: updatedTag.toJSON() } };
  }

  @ApiOkResponse({
    type: () => EntityResponse<TagEntity>,
    description: 'The tag was updated successfully',
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
    tagData: PatchTagDto,
  ): Promise<EntityResponse<TagEntity>> {
    const updateCategory = await this.tagService.update(id, tagData);

    return { data: { item: updateCategory.toJSON() } };
  }

  @ApiOkResponse({
    type: () => DeleteResponse,
    description: 'The tag was overwrite successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResponse> {
    const { deleted } = await this.tagService.remove(id);

    return { data: { deleted } };
  }
}
