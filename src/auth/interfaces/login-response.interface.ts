interface UserResponse {
  user_id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  avatar: string;
  status?: boolean;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
}
