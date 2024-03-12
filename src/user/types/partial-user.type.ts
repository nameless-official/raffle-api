import { User } from '../entities/user.entity';

export type PartialUser = Omit<User, 'password'>;
