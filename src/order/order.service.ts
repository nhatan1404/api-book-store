import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { BaseService } from 'src/common/base/base.service';
import { EntityId } from 'typeorm/repository/EntityId';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService extends BaseService<Order, OrderRepository> {
  constructor(repository: OrderRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(OrderService.name);
  }

  findById(id: EntityId): Promise<Order> {
    return this.repository.findOne(id, { relations: ['details'] });
  }

  findByOrderNumber(orderNumber: string): Promise<Order> {
    return this.repository.findOne({
      relations: ['details'],
      where: { orderNumber },
    });
  }
}
