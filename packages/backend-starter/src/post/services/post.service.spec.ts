import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { PostEntity, ProfileEntity, UserEntity } from '../../models';
import { NodeConfigService } from '../../shared/services/node-config.service';
import { PostType } from '../constants/post.constant';
import { CreatePostDto } from '../dto/create-post.dto';
import { PatchPostDto } from '../dto/patch-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostService } from './post.service';

const postMock = {
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

describe('PostService', () => {
  let service: PostService;
  let post: typeof PostEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: getModelToken(PostEntity), useValue: postMock },
        { provide: NodeConfigService, useValue: nodeConfigServiceMock },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    post = module.get<typeof PostEntity>(getModelToken(PostEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call post.findAll with arguments when call find method', async () => {
    // Arrange
    const args = { filter: { id: 'abcd-efgh-ijkl-mnop' } };
    const expectedArgs = {
      limit: 200,
      offset: 0,
      where: {
        ...args.filter,
      },
      attributes: {
        exclude: ['userId'],
      },
      include: [
        {
          model: UserEntity,
          include: [
            {
              model: ProfileEntity,
              attributes: {
                exclude: ['userId'],
              },
            },
          ],
        },
      ],
    };

    // Act
    await service.find(args);

    // Assert
    expect(post.findAll).toHaveBeenCalledTimes(1);
    expect(post.findAll).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call post.findByPk with arguments when call findById method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';

    // Act
    await service.findById(id);

    // Assert
    expect(post.findByPk).toHaveBeenCalledTimes(1);
    expect(post.findByPk).toHaveBeenCalledWith(id);
  });

  it('should return null when call findById method and any post was found', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    jest
      .spyOn(post, 'findByPk')
      .mockImplementationOnce(() => Promise.resolve(null));

    // Act
    const result = await service.findById(id);

    // Assert
    expect(result).toBeNull();
    expect(post.findByPk).toHaveBeenCalledTimes(1);
    expect(post.findByPk).toHaveBeenCalledWith(id);
  });

  it('should call post.count with arguments when call count method', async () => {
    // Arrange
    const args = { filter: { published: true } };
    const expectedArgs = { where: { published: true } };

    // Act
    await service.count(args);

    // Assert
    expect(post.count).toHaveBeenCalledTimes(1);
    expect(post.count).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call post.create with arguments when call create method', async () => {
    // Arrange
    const user = { id: 'abcd-efgh-ijkl-mnop' };
    const data: CreatePostDto = {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sagittis.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque consectetur nunc mi, nec ullamcorper augue maximus id. Nam lacinia sapien.',
      published: true,
      type: PostType.TEXT,
    };
    const expectedArgs = { ...data, authorId: user.id };

    // Act
    await service.create(data, user);

    // Assert
    expect(post.create).toHaveBeenCalledTimes(1);
    expect(post.create).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call save instance method with arguments and update all post data when call overwrite method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const authorId = 'rmno-abcd-jihk-zxfi';
    const oldPost = {
      id,
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sagittis.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque consectetur nunc mi, nec ullamcorper augue maximus id. Nam lacinia sapien.',
      published: true,
      type: PostType.TEXT,
      authorId,
      save: jest.fn(),
    };
    const data: UpdatePostDto = {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor leo sit amet lobortis tempor. Sed in luctus felis, non.',
      published: false,
      type: PostType.GALLERY,
    };
    jest.spyOn(service, 'findById');
    (post.findByPk as any).mockReturnValue(oldPost);

    // Act
    await service.overwrite(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldPost.authorId).toBe(authorId);
    expect(oldPost.content).toBe(data.content);
    expect(oldPost.title).toBe(data.title);
    expect(oldPost.published).toBe(data.published);
    expect(oldPost.type).toBe(data.type);
    expect(oldPost.save).toHaveBeenCalledTimes(1);
    expect(oldPost.save).toHaveBeenCalledWith();
  });

  it('should call save instance method with arguments and update properties of the post when call update method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const title =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sagittis.';
    const content =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque consectetur nunc mi, nec ullamcorper augue maximus id. Nam lacinia sapien.';
    const published = true;
    const type = PostType.TEXT;
    const authorId = 'rmno-abcd-jihk-zxfi';
    const oldPost = {
      id,
      title,
      content,
      published,
      type,
      authorId,
      save: jest.fn(),
    };
    const data: PatchPostDto = {
      published: false,
    };
    jest.spyOn(service, 'findById');
    (post.findByPk as any).mockReturnValue(oldPost);

    // Act
    await service.update(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldPost.authorId).toBe(authorId);
    expect(oldPost.content).toBe(content);
    expect(oldPost.title).toBe(title);
    expect(oldPost.published).toBeFalsy();
    expect(oldPost.type).toBe(type);
    expect(oldPost.save).toHaveBeenCalledTimes(1);
    expect(oldPost.save).toHaveBeenCalledWith();
  });

  it('should not update the post data when call update method with empty data', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const title =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sagittis.';
    const content =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque consectetur nunc mi, nec ullamcorper augue maximus id. Nam lacinia sapien.';
    const published = true;
    const type = PostType.TEXT;
    const authorId = 'rmno-abcd-jihk-zxfi';
    const oldPost = {
      id,
      title,
      content,
      published,
      type,
      authorId,
      save: jest.fn(),
    };
    const data: PatchPostDto = {
      title: '',
    };
    jest.spyOn(service, 'findById');
    (post.findByPk as any).mockReturnValue(oldPost);

    // Act
    await service.update(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldPost.authorId).toBe(authorId);
    expect(oldPost.content).toBe(content);
    expect(oldPost.title).toBe(title);
    expect(oldPost.published).toBe(published);
    expect(oldPost.type).toBe(type);
    expect(oldPost.save).toHaveBeenCalledTimes(1);
    expect(oldPost.save).toHaveBeenCalledWith();
  });

  it('should call save instance method with arguments and set an empty content when call update method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const title =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sagittis.';
    const content =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque consectetur nunc mi, nec ullamcorper augue maximus id. Nam lacinia sapien.';
    const published = true;
    const type = PostType.TEXT;
    const authorId = 'rmno-abcd-jihk-zxfi';
    const oldPost = {
      id,
      title,
      content,
      published,
      type,
      authorId,
      save: jest.fn(),
    };
    const data: PatchPostDto = {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sagittis.',
      content: '',
    };
    jest.spyOn(service, 'findById');
    (post.findByPk as any).mockReturnValue(oldPost);

    // Act
    await service.update(id, data);

    // Assert
    expect(service.findById).toHaveBeenCalledTimes(1);
    expect(service.findById).toHaveBeenCalledWith(id);
    expect(oldPost.authorId).toBe(authorId);
    expect(oldPost.content).toBe(data.content);
    expect(oldPost.title).toBe(data.title);
    expect(oldPost.published).toBe(published);
    expect(oldPost.type).toBe(type);
    expect(oldPost.save).toHaveBeenCalledTimes(1);
    expect(oldPost.save).toHaveBeenCalledWith();
  });

  it('should call post.delete with arguments when call remove method', async () => {
    // Arrange
    const id = 'abcd-efgh-ijkl-mnop';
    const expectedArgs = { where: { id } };
    jest.spyOn(service, 'findById');
    (post.findByPk as any).mockReturnValue({});

    // Act
    await service.remove(id);

    // Assert
    expect(post.destroy).toHaveBeenCalledTimes(1);
    expect(post.destroy).toHaveBeenCalledWith(expectedArgs);
  });
});
