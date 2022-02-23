import {
  IsOptional,
  IsString,
  Length,
  IsNotEmpty,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { OrderStatus } from '../enum/status-order.enum';

export class UpdateOrderDTO {
  @IsNotEmpty({ message: 'Họ tên không được bỏ trống' })
  @Length(2, 150, { message: 'Họ tên phải chứa từ 2 đến 150 kí tự' })
  fullName: string;

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

  @IsNotEmpty({ message: 'Địa chỉ không được bỏ trống' })
  @Length(15, 255, { message: 'Địa chỉ phải từ 15 đến 255 kí tự' })
  address: string;

  @IsNotEmpty({ message: 'Trạngt thái không được bỏ trống' })
  @IsEnum(OrderStatus, { message: 'Trạng thái không hợp lệ' })
  status: OrderStatus;
}
