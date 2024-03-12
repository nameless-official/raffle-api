import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginResponse } from './interfaces/login-response.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { username, password } = loginDto;
    const invalidCredentialsMessage =
      'Sorry, but the credentials provided are invalid. Please verify that you have entered your username and password correctly.';
    const [user] = await this.userService.search(
      { conditions: [{ field: 'username', value: username, operator: '=' }] },
      {},
    );

    if (!user) throw new UnauthorizedException(invalidCredentialsMessage);
    if (!compareSync(atob(password), user.password)) throw new UnauthorizedException(invalidCredentialsMessage);
    if (!user.status) throw new UnauthorizedException('Sorry, but your user account is not active at this time.');

    const { password: _, ...rest } = JSON.parse(JSON.stringify(user));
    return {
      user: rest,
      token: this.getJwtToken({ user_id: user.user_id.toString() }),
    };
  }

  getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
