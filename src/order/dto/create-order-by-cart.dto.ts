import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { castStringToNumber } from '../../common/utils/utilities.util';
import { IsValidId } from '../../common/validators/is-valid-id.validator';
import { Address } from '../../address/address.entity';
import { CartItem } from '../../cart/cart-items.entity';

export class ListCartItemId {
  @IsNotEmpty({
    message: 'Mã item không được bỏ trống',
  })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Mã item phải là số nguyên' })
  @IsValidId(CartItem, { message: 'Mã item không hợp lệ' })
  id: number;
}

export class CreateOrderByCartDTO {
  @IsOptional()
  @IsString({
    message: 'Ghi chú phải là chuỗi',
  })
  @Length(5, 255, {
    message: 'Ghi chú phải chứa từ 5 đến 255 kí tự',
  })
  note: string;

  @IsNotEmpty({
    message: 'Mã địa chỉ không được bỏ trống',
  })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Mã địa chỉ giao hàng phải là số nguyên ' })
  @IsValidId(Address, { message: 'Mã địa chỉ giao hàng không hợp lệ' })
  address: number;

  @IsNotEmpty({ message: 'Danh sách sách không được bỏ trống' })
  @ValidateNested({ each: true })
  @Type(() => ListCartItemId)
  items: ListCartItemId[];
}
