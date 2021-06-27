import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express'
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler()) // ! access meta data
    console.log("🚀 ~ file: api-key.guard.ts ~ line 19 ~ ApiKeyGuard ~ isPublic", this.reflector.get(IS_PUBLIC_KEY, context.getHandler()) )
    if (isPublic ) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const authHeader = request.header('Authorization')

    return authHeader === this.configService.get('API_KEY')
  }
}
