import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserService } from 'src/user/user.service';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private userService: UserService) {}

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('/check-token')
  async checkToken(@Request() req: Request) {
    const user_id = req['user_id'];
    const userResponse = await this.userService.findOne(user_id);
    const { password: _, ...rest } = userResponse;
    return {
      user: rest,
      token: this.authService.getJwtToken({ user_id }),
    };
  }
}
