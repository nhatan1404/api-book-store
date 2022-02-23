import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from '../book/book.service';
import { Profile } from '../common/decorators/user.decorator';
import { User } from '../user/user.entity';
import { CartItemService } from './cart-item.service';
import { CartItem } from './cart-items.entity';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { CreateCartItemDTO } from './dto/create-cart-item.dto';
import { DeleteCartItemDTO } from './dto/delete-cart-item.dto';
import { UpdateCartItemDTO } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
    private readonly bookService: BookService,
  ) {}

  @Get()
  async getCurrentCart(@Profile() currentUser: User): Promise<Cart> {
    return this.cartService.getCurrentCart(currentUser.id);
  }

  @Post()
  async addItemToCart(
    @Profile() currentUser: User,
    @Body() cartData: CreateCartItemDTO,
  ) {
    const currentCart = await this.cartService.getCurrentCart(currentUser.id);

    const listItems = await this.cartItemService.findAllByCartId(
      currentCart.id,
    );

    const existItem: CartItem = listItems.find(
      (item) => item.book.id === cartData.bookId,
    );

    if (!existItem) {
      return this.cartItemService.store({
        book: cartData.bookId,
        quantity: cartData.quantity,
        cart: currentCart.id,
      });
    }

    return this.cartItemService.update(existItem.id, {
      quantity: existItem.quantity + cartData.quantity,
    });
  }

  @Put()
  async updateQuantity(
    @Profile() currentUser: User,
    @Body() cartData: UpdateCartItemDTO,
  ) {
    const currentCart = await this.cartService.getCurrentCart(currentUser.id);

    const item: CartItem = currentCart.cartItems.find(
      (item) => item.id === cartData.itemId,
    );

    if (!item) {
      throw new BadRequestException('Mã item không hợp lệ');
    }

    return this.cartItemService.update(item.id, {
      quantity: cartData.quantity,
    });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeItemFromCart(
    @Profile() currentUser: User,
    @Body() cartData: DeleteCartItemDTO,
  ): Promise<void> {
    const currentCart = await this.cartService.getCurrentCart(currentUser.id);

    const item: CartItem = currentCart.cartItems.find(
      (item) => item.id === cartData.itemId,
    );

    if (!item) {
      throw new BadRequestException('Mã item không hợp lệ');
    }

    const { affected } = await this.cartItemService.delete(cartData.itemId);

    if (affected === 0) {
      throw new BadRequestException(
        `Xoá item có mã bằng ${cartData.itemId} không thành công`,
      );
    }
  }
}
