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
  Req,
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
import { AuthenticatedRequest } from '../../auth/types/authenticated-request.type';
import { PostEntity } from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import {
  CollectionResponse,
  CountResponse,
  DeleteResponse,
  EntityResponse,
} from '../../shared/responses';
import { CreatePostDto } from '../dto/create-post.dto';
import { PatchPostDto } from '../dto/patch-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostService } from '../services/post.service';

@ApiTags('Posts controller')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOkResponse({
    type: () => CollectionResponse<PostEntity[]>,
    description: 'A list of posts',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get()
  async find(
    @Query() query?: IAppQueryString,
  ): Promise<CollectionResponse<PostEntity[]>> {
    const posts = await this.postService.find(query);

    return {
      data: { items: posts.map((post) => post.toJSON()) },
    };
  }

  @ApiFoundResponse({
    type: () => EntityResponse<PostEntity>,
    description: 'A found post',
  })
  @ApiNotFoundResponse({ description: 'Any post was found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<EntityResponse<PostEntity>> {
    const post = await this.postService.findById(id);

    if (!post) {
      throw new NotFoundException('post_exception_not_found');
    }

    return { data: { item: post.toJSON() } };
  }

  @ApiOkResponse({
    type: () => CountResponse,
    description: 'A sum of all posts in the system',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get('count')
  async count(
    @Query()
    query?: IAppQueryString,
  ): Promise<CountResponse> {
    const { count } = await this.postService.count(query);

    return { data: { count } };
  }

  @ApiCreatedResponse({
    type: () => EntityResponse<PostEntity>,
    description: 'The post was created successfully',
  })
  @ApiConflictResponse({
    description: 'A previous post was found with the same main constraints',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() postData: CreatePostDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<EntityResponse<PostEntity>> {
    const newPost = await this.postService.create(postData, req.user);

    return { data: { item: newPost.toJSON() } };
  }

  @ApiOkResponse({
    type: () => EntityResponse<PostEntity>,
    description: 'The post was overwrite successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async overwrite(
    @Param('id') id: string,
    @Body() postData: UpdatePostDto,
  ): Promise<EntityResponse<PostEntity>> {
    const updatedPost = await this.postService.overwrite(id, postData);

    return { data: { item: updatedPost.toJSON() } };
  }

  @ApiOkResponse({
    type: () => EntityResponse<PostEntity>,
    description: 'The post was updated successfully',
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
    postData: PatchPostDto,
  ): Promise<EntityResponse<PostEntity>> {
    const updatedPost = await this.postService.update(id, postData);

    return { data: { item: updatedPost.toJSON() } };
  }

  @ApiOkResponse({
    type: () => DeleteResponse,
    description: 'The post was overwrite successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResponse> {
    const { deleted } = await this.postService.remove(id);

    return { data: { deleted } };
  }
}
