import { Request } from 'express';
import { UserWithoutPassword } from '../../user/types/user-types.type';

export type AuthenticatedRequest = Request & { user: UserWithoutPassword };
