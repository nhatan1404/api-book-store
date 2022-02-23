import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { BaseService } from 'src/common/base/base.service';
import { OrderDetail } from './order-detail.entity';
import { OrderDetailRepository } from './order-detail.repository';

@Injectable()
export class OrderDetailService extends BaseService<
  OrderDetail,
  OrderDetailRepository
> {
  constructor(repository: OrderDetailRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(OrderDetailService.name);
  }
}
