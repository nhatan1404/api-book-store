import { IS_PUBLIC_KEY } from './../common/constants/decorator.contants';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { User } from '../user/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    protected readonly reflector: Reflector,
    @InjectRolesBuilder() protected readonly roleBuilder: RolesBuilder,
  ) {
    super();
  }

  protected canPublic(
    reflector: Reflector,
    context: ExecutionContext,
  ): boolean {
    return reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  protected async getUser(context: ExecutionContext): Promise<User> {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }

  public canActivate(context: ExecutionContext) {
    const isPublic: boolean = this.canPublic(this.reflector, context);
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
