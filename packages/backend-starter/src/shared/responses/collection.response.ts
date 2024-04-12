import { ApiProperty } from '@nestjs/swagger';
import { IApiResponse } from '../interfaces/api-response.interface';

export class CollectionResponse<T> implements IApiResponse<T> {
  @ApiProperty({
    type: () =>
      class {
        items: T;
      },
  })
  data: {
    items: T;
  };
}
