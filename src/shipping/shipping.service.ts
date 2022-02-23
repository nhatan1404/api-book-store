import { ShippingRepository } from './shipping.repository';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/base/base.service';
import { Shipping } from './shipping.entity';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ShippingService extends BaseService<Shipping, ShippingRepository> {
  constructor(repository: ShippingRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(ShippingService.name);
  }
}
