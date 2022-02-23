import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { BaseService } from '../common/base/base.service';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService extends BaseService<Role, RoleRepository> {
  constructor(repository: RoleRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(RoleService.name);
  }

  async getGrantList() {
    const roles = await this.repository.find({
      relations: ['permissions'],
    });
    let result = [];

    for (const role of roles) {
      const per = role.permissions.map((permission) => {
        const basePermission = {
          role: role.name,
          resource: permission.resource,
        };
        return [
          { ...basePermission, action: permission.canRead },
          { ...basePermission, action: permission.canCreate },
          { ...basePermission, action: permission.canEdit },
          { ...basePermission, action: permission.canDelete },
        ];
      });

      result = [...result, ...per.flat()];
    }
    return result;
  }
}
