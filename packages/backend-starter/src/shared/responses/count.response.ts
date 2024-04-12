import { IApiResponse } from '../interfaces/api-response.interface';

export class CountResponse implements IApiResponse<number> {
  data: {
    count: number;
  };
}
