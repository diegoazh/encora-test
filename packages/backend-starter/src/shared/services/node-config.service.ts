import { Injectable } from '@nestjs/common';
import config, { IConfig } from 'config';

@Injectable()
export class NodeConfigService {
  public readonly config: IConfig;

  constructor() {
    this.config = config;
  }
}
