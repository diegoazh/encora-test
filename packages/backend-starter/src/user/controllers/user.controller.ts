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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards';
import { UserEntity } from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import {
  CollectionResponse,
  CountResponse,
  DeleteResponse,
  EntityResponse,
} from '../../shared/responses';
import { PatchUserDto } from '../dto/patch-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';

@ApiTags('Users controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    type: () => CollectionResponse<UserEntity[]>,
    description: 'A list of found users',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get()
  async find(
    @Query() query?: IAppQueryString,
  ): Promise<CollectionResponse<UserEntity[]>> {
    const users = await this.userService.find(query);

    return { data: { items: users.map((user) => user.toJSON()) } };
  }

  @ApiFoundResponse({
    type: () => EntityResponse<UserEntity>,
    description: 'A user object that match with the provided id',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<EntityResponse<UserEntity>> {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('user_exception_not_found');
    }

    return { data: { item: user.toJSON() } };
  }

  @ApiOkResponse({
    type: () => CountResponse,
    description: 'The sum of all users in the system',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Get('count')
  async count(
    @Query()
    query?: IAppQueryString,
  ): Promise<CountResponse> {
    const { count } = await this.userService.count(query);

    return { data: { count } };
  }

  @ApiOkResponse({
    type: () => EntityResponse<UserEntity>,
    description: 'The user was overwrite successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Put(':id')
  async overwrite(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<EntityResponse<UserEntity>> {
    const updatedUser = await this.userService.overwrite(id, user);

    return { data: { item: updatedUser.toJSON() } };
  }

  @ApiOkResponse({
    type: () => EntityResponse<UserEntity>,
    description: 'The properties of the user were updated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    user: PatchUserDto,
  ): Promise<EntityResponse<UserEntity>> {
    const updatedUser = await this.userService.update(id, user);

    return { data: { item: updatedUser.toJSON() } };
  }

  @ApiOkResponse({
    type: () => DeleteResponse,
    description: 'The user was deleted successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'When hit the endpoint without a valid login',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error occurs' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResponse> {
    const { deleted } = await this.userService.remove(id);

    return { data: { deleted } };
  }
}
