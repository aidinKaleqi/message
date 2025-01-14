import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request?.headers?.user) {
      request.headers.user = JSON.parse(request.headers.user);
      return true;
    }
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('No or invalid token provided');
    }

    const token = authorization.split(' ')[1];

    try {
      const response = await firstValueFrom(
        this.httpService.post('http://127.0.0.1:8000/api/auth/verify', {
          token,
        }),
      );
      request.user = response.data.data;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
