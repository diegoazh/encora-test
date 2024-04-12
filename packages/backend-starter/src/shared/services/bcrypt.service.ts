import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

@Injectable()
export class BcryptService {
  private saltRounds = 10;

  private salt;

  constructor() {
    this.salt = bcrypt.genSaltSync(this.saltRounds);
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.salt);
  }

  checkPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
