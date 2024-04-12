import { UserEntity } from '../../models';

export type UserWithoutPassword = Omit<Partial<UserEntity>, 'password'>;
export type CleanedUser<T> = T extends UserEntity
  ? UserWithoutPassword
  : UserWithoutPassword[];
