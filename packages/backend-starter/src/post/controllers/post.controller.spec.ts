import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type';
import { mockServiceFactory } from '../../../test/utils/utils';
import { PostType } from '../constants/post.constant';
import { CreatePostDto } from '../dto/create-post.dto';
import { PatchPostDto } from '../dto/patch-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostService } from '../services/post.service';
import { PostController } from './post.controller';

describe('PostController', () => {
  let controller: PostController;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [{ provide: PostService, useFactory: mockServiceFactory }],
    }).compile();

    controller = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call postService.find with provided args when receive a GET HTTP request on /posts', async () => {
    // Arrange
    const title = 'Test title';
    const args = { filter: { title } };

    // Act
    await controller.find(args);

    // Assert
    expect(postService.find).toHaveBeenCalledTimes(1);
    expect(postService.find).toHaveBeenCalledWith(args);
  });

  it('should call postService.findById with provided args when receive a GET HTTP request on /posts/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';

    // Act
    await controller.findById(id);

    // Assert
    expect(postService.findById).toHaveBeenCalledTimes(1);
    expect(postService.findById).toHaveBeenCalledWith(id);
  });

  it('should call postService.count with provided args when receive a GET HTTP request on /posts/count', async () => {
    // Arrange
    const args = { where: { published: true } } as any;

    // Act
    await controller.count(args);

    // Assert
    expect(postService.count).toHaveBeenCalledTimes(1);
    expect(postService.count).toHaveBeenCalledWith(args);
  });

  it('should call postService.create with provided args when receive a POST HTTP request on /posts', async () => {
    // Arrange
    const req = {
      user: { id: 'abcd-efgh-ijkl-mnop' },
    } as unknown as AuthenticatedRequest;
    const post: CreatePostDto = {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sagittis.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque consectetur nunc mi, nec ullamcorper augue maximus id. Nam lacinia sapien.',
      published: true,
      type: PostType.TEXT,
    };

    // Act
    await controller.create(post, req);

    // Assert
    expect(postService.create).toHaveBeenCalledTimes(1);
    expect(postService.create).toHaveBeenCalledWith(post, req.user);
  });

  it('should call postService.overwrite with provided args when receive a PUT HTTP request on /posts/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const post: UpdatePostDto = {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor leo sit amet lobortis tempor. Sed in luctus felis, non.',
      published: false,
      type: PostType.GALLERY,
    };

    // Act
    await controller.overwrite(id, post);

    // Assert
    expect(postService.overwrite).toHaveBeenCalledTimes(1);
    expect(postService.overwrite).toHaveBeenCalledWith(id, post);
  });

  it('should call postService.update with provided args when receive a PATCH HTTP request on /posts/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const post: PatchPostDto = {
      published: false,
    };

    // Act
    await controller.update(id, post);

    // Assert
    expect(postService.update).toHaveBeenCalledTimes(1);
    expect(postService.update).toHaveBeenCalledWith(id, post);
  });

  it('should call postService.remove with provided args when receive a DELETE HTTP request on /posts/:id', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';

    // Act
    await controller.remove(id);

    // Assert
    expect(postService.remove).toHaveBeenCalledTimes(1);
    expect(postService.remove).toHaveBeenCalledWith(id);
  });
});
