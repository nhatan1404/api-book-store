import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { castStringToNumber } from '../../common/utils/utilities.util';
import { IsValidId } from '../../common/validators/is-valid-id.validator';
import { User } from '../../user/user.entity';
import { BaseOrder } from './base-order.dto';

export class CreateOrderDTO extends BaseOrder {
  @IsOptional()
  @IsString({
    message: 'Ghi chú phải là chuỗi',
  })
  @Length(5, 255, {
    message: 'Ghi chú phải chứa từ 5 đến 255 kí tự',
  })
  note: string;

  @IsNotEmpty({ message: 'Email không được bỏ trống' })
  @IsEmail({ message: 'Email không hợp lệ' })
  email: string;

  @IsOptional()
  @Length(10, 12, { message: 'Số điện thoại phải từ 10 đến 12 kí tự' })
  phone: string;

  @IsNotEmpty({ message: 'Mã người dùng không được bỏ trống' })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Mã người dùng phải là số nguyên' })
  @IsValidId(User, { message: 'Mã người dùng không hợp lệ' })
  user: number;

  @IsNotEmpty({ message: 'Địa chỉ không được bỏ trống' })
  @Length(15, 255, { message: 'Địa chỉ phải từ 15 đến 255 kí tự' })
  address: string;
}
