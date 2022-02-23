import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from '../book/book.module';
import { CartItemRepository } from './cart-item.repository';
import { CartItemService } from './cart-item.service';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { CartService } from './cart.service';

@Module({
  imports: [
    BookModule,
    TypeOrmModule.forFeature([CartRepository, CartItemRepository]),
  ],
  controllers: [CartController],
  providers: [CartService, CartItemService],
  exports: [CartService, CartItemService],
})
export class CartModule {}
