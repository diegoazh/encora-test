import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from '../../models';
import { UserWithoutPassword } from '../../user/types/user-types.type';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger('LocalStrategy');

  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    const data: Partial<UserEntity> = { email, password };
    const user = await this.authService.validateUser(data);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
