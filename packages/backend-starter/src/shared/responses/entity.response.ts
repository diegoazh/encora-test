import { ApiProperty } from '@nestjs/swagger';
import { IApiResponse } from '../interfaces/api-response.interface';

export class EntityResponse<T> implements IApiResponse<T> {
  @ApiProperty({
    type: () =>
      class {
        item: T;
      },
  })
  data: {
    item: T;
  };
}
