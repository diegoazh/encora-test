import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

const configServiceMock = {
  get: jest.fn((arg) => arg),
};

describe('CryptoService', () => {
  let service: CryptoService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(config).toBeDefined();
  });
});
