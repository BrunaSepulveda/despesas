import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Sem autorização');
    }
    try {
      const payload = await this.jwtService.verifyAsync<{
        id: string;
        email: string;
      }>(token, {
        secret: process.env.JWT_SECRET,
      });
      if (payload?.id) {
        const user = await this.userService.getOne(payload.id);
        request['user'] = user;
      }
    } catch {
      throw new UnauthorizedException('Sem autorização');
    }
    return true;
  }
}
