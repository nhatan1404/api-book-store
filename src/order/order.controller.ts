import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Session,
} from '@nestjs/common';
import { UseRoles } from 'nest-access-control';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EntityId } from 'typeorm/repository/EntityId';
import { AddressService } from '../address/address.service';
import { BookService } from '../book/book.service';
import { CartItemService } from '../cart/cart-item.service';
import { CartService } from '../cart/cart.service';
import { Profile } from '../common/decorators/user.decorator';
import { Coupon } from '../coupon/coupon.entity';
import { CouponService } from '../coupon/coupon.service';
import { CouponType } from '../coupon/enum/coupon-type.enum';
import { User } from '../user/user.entity';
import { CreateOrderByCartDTO } from './dto/create-order-by-cart.dto';
import { OrderStatus } from './enum/status-order.enum';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrderDTO } from './dto/create-order.dto';
import { Book } from '../book/book.entity';
import { UserService } from '../user/user.service';
import { UpdateOrderDTO } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly bookService: BookService,
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
    private readonly addressService: AddressService,
    private readonly couponService: CouponService,
    private readonly userService: UserService,
  ) {}

  @UseRoles({
    resource: 'order',
    action: 'read',
    possession: 'any',
  })
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Order>> {
    return this.orderService.findAll(
      { page, limit },
      { relations: ['details'] },
    );
  }

  @UseRoles({
    resource: 'order',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  show(@Param('id', ParseIntPipe) id: EntityId): Promise<Order> {
    return this.orderService.findById(id);
  }

  @UseRoles({
    resource: 'order',
    action: 'read',
    possession: 'own',
  })
  @Get('id/:order_number')
  showByOrderNumber(
    @Param('order_number') orderNumber: string,
  ): Promise<Order> {
    return this.orderService.findByOrderNumber(orderNumber);
  }

  @UseRoles({
    resource: 'order',
    action: 'read',
    possession: 'any',
  })
  @Post()
  async create(
    @Body() orderData: CreateOrderDTO,
    @Session() session: Record<string, any>,
  ) {
    const bookIds: number[] = orderData.items.map((item) => item.id);
    const bookList: Book[] = await this.bookService.findByIds(bookIds);

    if (bookList.length <= 0) {
      throw new BadRequestException('Danh sách sách trống');
    }

    const listItems: Array<{ quantity: number; price: number; book: number }> =
      [];

    for (const [index, detail] of orderData.items.entries()) {
      if (detail.quantity > bookList[index].quantity) {
        throw new BadRequestException(
          'Số lượng đặt hàng không được lớn hơn số lượng trong kho',
        );
      }
      listItems.push({
        quantity: detail.quantity,
        price: bookList[index].price,
        book: detail.id,
      });
    }

    const user = await this.userService.findById(orderData.user);
    const couponId = session.couponId ? session.couponId : 0;
    delete session.couponId;

    const [discountPrice, total] = await this.getDiscontPriceAndTotal(
      listItems,
      couponId,
    );

    const data = {
      orderNumber: uuidv4(),
      fullName: user.getFullName(),
      address: orderData.address,
      email: orderData.email,
      phone: orderData.phone,
      note: orderData.note,
      discountPrice,
      total,
      status: OrderStatus.NEW,
      user: user.id,
      details: listItems,
    };

    try {
      return this.orderService.store(data);
    } catch {
      throw new InternalServerErrorException('Có lỗi xảy ra');
    }
  }

  @UseRoles({
    resource: 'order',
    action: 'create',
    possession: 'own',
  })
  @Post('/create-by-cart')
  async order(
    @Profile() currentUser: User,
    @Body() orderData: CreateOrderByCartDTO,
    @Session() session: Record<string, any>,
  ) {
    const address = await this.addressService.findByIdAndUserId(
      orderData.address,
      currentUser.id,
    );

    if (!address) {
      throw new BadRequestException('Mã địa chỉ không hợp lệ');
    }

    const currentCart = await this.cartService.getCurrentCart(currentUser.id);
    const listAllItems = await this.cartItemService.findAllByCartId(
      currentCart.id,
    );

    const listIdChecked = orderData.items.map((item) => item.id);
    const listItemsChecked = listAllItems.filter((item) =>
      listIdChecked.includes(item.id),
    );

    if (listItemsChecked.length <= 0) {
      throw new BadRequestException('Danh sách sách trống');
    }

    for (const item of listItemsChecked) {
      if (item.quantity > item.book.quantity) {
        throw new BadRequestException(
          'Số lượng đặt hàng không được lớn hơn số lượng trong kho',
        );
      }
    }

    const couponId = session.couponId ? session.couponId : 0;
    delete session.couponId;

    const listItems = listItemsChecked.map((item) => ({
      quantity: item.quantity,
      price: item.book.price,
    }));
    const [discountPrice, total] = await this.getDiscontPriceAndTotal(
      listItems,
      couponId,
    );

    const details = listItemsChecked.map((item) => ({
      quantity: item.quantity,
      price: item.book.price,
      book: item.book.id,
    }));

    const data = {
      orderNumber: uuidv4(),
      fullName: currentUser.getFullName(),
      address: address.getFullAddress(),
      email: address.email,
      phone: address.phone,
      note: orderData.note,
      discountPrice,
      total,
      status: OrderStatus.NEW,
      user: currentUser.id,
      details,
    };

    try {
      const order = await this.orderService.store(data);
      if (order) {
        this.cartService.deactivate(currentCart.id);
      }
      return order;
    } catch {
      throw new InternalServerErrorException('Có lỗi xảy ra');
    }
  }

  @UseRoles({
    resource: 'order',
    action: 'update',
    possession: 'any',
  })
  @Put(':id')
  async edit(
    @Param('id', ParseIntPipe) id: EntityId,
    @Body() orderData: UpdateOrderDTO,
  ) {
    const order = await this.orderService.findById(id);

    if (!order) {
      throw new NotFoundException(
        `Đơn đặt hàng có mã bằng ${id} không tồn tại`,
      );
    }

    return this.orderService.update(id, orderData);
  }

  private async getDiscontPriceAndTotal(
    items: Array<{ quantity: number; price: number }>,
    couponId: number,
  ): Promise<[number, number]> {
    const total = items.reduce((acc, item) => {
      return acc + item.quantity * item.price;
    }, 0);

    const coupon: Coupon = await this.couponService.findById(couponId);

    if (coupon) {
      if (coupon.type === CouponType.FIXED) {
        return [coupon.value, total - coupon.value];
      } else {
        const discount = total - total * (coupon.value / 100);
        return [discount, total - discount];
      }
    }
    return [0, total];
  }
}
