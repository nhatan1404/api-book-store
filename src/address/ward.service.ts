import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { BaseService } from '../common/base/base.service';
import { Ward } from './ward.entity';
import { WardRepository } from './ward.repository';

@Injectable()
export class WardService extends BaseService<Ward, WardRepository> {
  constructor(repository: WardRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(WardService.name);
  }

  getListWardByDistictId(id: number): Promise<Ward[]> {
    return this.repository.find({
      where: {
        parentCode: id,
      },
    });
  }
}
