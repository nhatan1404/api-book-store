import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { castStringToNumber } from '../../common/utils/utilities.util';
import { ShippingStatus } from '../enum/shipping-status.enum';

export class CreateShippingDTO {
  @IsNotEmpty({ message: 'Địa chỉ không được bỏ trống' })
  address: string;

  @IsNotEmpty({ message: 'Phí vận chuyển không được bỏ trông' })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Phí vận chuyển phải là số' })
  price: number;

  @IsNotEmpty({ message: 'Trạng thái không được bỏ trống' })
  @IsEnum(ShippingStatus, { message: 'Trạng thái không hợp lệ' })
  status: ShippingStatus;
}
