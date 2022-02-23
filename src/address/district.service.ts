import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { BaseService } from '../common/base/base.service';
import { District } from './district.entity';
import { DistrictRepository } from './district.repository';

@Injectable()
export class DistrictService extends BaseService<District, DistrictRepository> {
  constructor(repository: DistrictRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(DistrictService.name);
  }

  getListDistrictByProvinceId(id: number): Promise<District[]> {
    return this.repository.find({
      where: {
        parentCode: id,
      },
    });
  }
}
