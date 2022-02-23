import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { UpdateResult } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import { BaseService } from '../common/base/base.service';
import { Cart } from './cart.entity';
import { CartRepository } from './cart.repository';
import { CartStatus } from './enum/status-cart.enum';

@Injectable()
export class CartService extends BaseService<Cart, CartRepository> {
  constructor(repository: CartRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(CartService.name);
  }

  async getCurrentCart(userId: EntityId): Promise<Cart> {
    const cart = await this.repository.findOne({
      relations: ['cartItems'],
      where: {
        user: { id: userId },
        status: CartStatus.ACTIVE,
      },
    });

    if (!cart) {
      return this.store({
        user: userId,
        status: CartStatus.ACTIVE,
      });
    }
    return cart;
  }

  deactivate(cartId: EntityId): Promise<UpdateResult> {
    return this.repository.update(cartId, { status: CartStatus.INACTIVE });
  }
}
