import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthConfig } from '../../config/auth-config';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization) {
      return false;
    }

    const [schema, base64] = authorization.split(' ');

    if (schema !== 'Basic') {
      return false;
    }

    if (!base64) {
      return false;
    }

    const payload = Buffer.from(base64, 'base64').toString('utf-8');
    if (!payload.includes(':')) {
      return false;
    }

    const [username, password] = payload.split(':');

    const authConfig = this.configService.get<AuthConfig>('auth');
    if (username !== authConfig.username) {
      return false;
    }

    if (password !== authConfig.password) {
      return false;
    }

    return true;
  }
}
