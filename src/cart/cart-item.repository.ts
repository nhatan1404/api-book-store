import { EntityRepository, Repository } from 'typeorm';
import { CartItem } from './cart-items.entity';

@EntityRepository(CartItem)
export class CartItemRepository extends Repository<CartItem> {}
