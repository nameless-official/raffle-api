import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const unauthorizedMessage = 'Lo sentimos, pero no tienes los permisos necesarios para acceder a este recurso.';
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException(unauthorizedMessage);

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findOne(parseInt(payload.user_id));

      if (!user.status)
        throw new UnauthorizedException('Lo sentimos, pero tu cuenta de usuario no está activa en este momento.');

      request['user_id'] = payload.user_id;
    } catch (error) {
      throw new UnauthorizedException(unauthorizedMessage);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
