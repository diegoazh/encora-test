import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  scryptSync,
} from 'crypto';

@Injectable()
export class CryptoService {
  private readonly iv = Buffer.alloc(16, 0); // alloc always the same buffer

  private readonly algorithm = 'aes-192-cbc'; // based on openssl algorithms

  private readonly salt = `b6G=*UrFL'dWWKg?BY_d][^CduKnnf%5`;

  private readonly keyLen = 24;

  private readonly password: string;

  private readonly key: Buffer;

  constructor(private readonly configService: ConfigService) {
    this.password = this.configService.get<string>('HASH_PASSWORD');
    this.key = scryptSync(this.password, this.salt, this.keyLen);
  }

  public encrypt(data: any): string {
    const cipher = createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
  }

  public decrypt(hash: string): any {
    const decipher = createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(hash, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }

  public md5(data: string): string {
    return createHash('md5').update(data).digest('hex');
  }
}
