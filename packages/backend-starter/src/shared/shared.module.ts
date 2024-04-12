import { Module } from '@nestjs/common';
import { BcryptService, CryptoService, NodeConfigService } from './services';

@Module({
  providers: [BcryptService, CryptoService, NodeConfigService],
  exports: [BcryptService, CryptoService, NodeConfigService],
})
export class SharedModule {}
