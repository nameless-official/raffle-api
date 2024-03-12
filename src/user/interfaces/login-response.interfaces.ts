import { PartialUser } from '../types/partial-user.type';

export interface LoginResponse {
  user: PartialUser;
  token: string;
}
