import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { OrderDetailRepository } from './order-detail.repository';
import { OrderDetailService } from './order-detail.service';
import { BookModule } from '../book/book.module';
import { CartModule } from '../cart/cart.module';
import { AddressModule } from '../address/address.module';
import { CouponModule } from '../coupon/coupon.module';
import { UserModule } from '../user/user.module';
import { ShippingModule } from '../shipping/shipping.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository, OrderDetailRepository]),
    BookModule,
    CartModule,
    AddressModule,
    CouponModule,
    UserModule,
    ShippingModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderDetailService],
})
export class OrderModule {}
