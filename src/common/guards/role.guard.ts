import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  InjectRolesBuilder,
  IQueryInfo,
  Role,
  RolesBuilder,
} from 'nest-access-control';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(
    readonly reflector: Reflector,
    @InjectRolesBuilder() readonly roleBuilder: RolesBuilder,
  ) {
    super(reflector, roleBuilder);
  }

  async canActivate(context: ExecutionContext) {
    const isPublic: boolean = this.canPublic(this.reflector, context);
    if (isPublic) {
      return true;
    }

    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const user = await this.getUser(context);

    const hasRoles = roles.every((role) => {
      const queryInfo: IQueryInfo = role;
      queryInfo.role = user.role.name;
      const permission = this.roleBuilder.permission(queryInfo);
      return permission.granted;
    });

    return hasRoles;
  }
}
