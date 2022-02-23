import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { BaseService } from '../common/base/base.service';
import { Permission } from './permission.entity';
import { PermissionRepository } from './permission.repository';

@Injectable()
export class PermissionService extends BaseService<
  Permission,
  PermissionRepository
> {
  constructor(repository: PermissionRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(Permission.name);
  }

  findByRoleIdAndReource(
    roleId: number,
    resource: string,
  ): Promise<Permission> {
    return this.repository.findOne({
      relations: ['role'],
      where: {
        resource: resource,
        role: {
          id: roleId,
        },
      },
    });
  }
}
