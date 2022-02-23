import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { BaseService } from '../common/base/base.service';
import { CartItem } from './cart-items.entity';
import { CartItemRepository } from './cart-item.repository';
import { EntityId } from 'typeorm/repository/EntityId';

@Injectable()
export class CartItemService extends BaseService<CartItem, CartItemRepository> {
  constructor(repository: CartItemRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(CartItemService.name);
  }

  async findAllByCartId(cartId: EntityId): Promise<CartItem[]> {
    return this.repository.find({
      relations: ['book'],
      where: { cart: cartId },
    });
  }
}
