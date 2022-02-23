import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { BaseService } from '../common/base/base.service';
import { Province } from './province.entity';
import { ProvinceRepository } from './province.repository';

@Injectable()
export class ProvinceService extends BaseService<Province, ProvinceRepository> {
  constructor(repository: ProvinceRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(ProvinceService.name);
  }

  getAll(): Promise<Province[]> {
    return this.repository.find();
  }
}
