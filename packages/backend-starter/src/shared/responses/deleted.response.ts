import { IApiResponse } from '../interfaces/api-response.interface';

export class DeleteResponse implements IApiResponse<number> {
  data: {
    deleted: number;
  };
}
