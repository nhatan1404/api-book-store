import { Transform } from 'class-transformer';
import { IsNotEmpty, Length, IsInt, IsEnum } from 'class-validator';
import { castStringToNumber } from '../../common/utils/utilities.util';
import { IsValidCouponValue } from '../../common/validators/is-valid-value-coupon.validator';
import { IsUnique } from '../../common/validators/is-unique.validator';
import { Coupon } from '../coupon.entity';
import { CouponStatus } from '../enum/coupon-status.enum';
import { CouponType } from '../enum/coupon-type.enum';

export class CreateCouponDTO {
  @IsNotEmpty({
    message: 'Code không được bỏ trống',
  })
  @Length(5, 20, {
    message: 'Code phải chứa từ 5 đến 20 kí tự',
  })
  @IsUnique(Coupon)
  code: string;

  @IsNotEmpty({ message: 'Loại không được bỏ trống' })
  @IsEnum(CouponType, {
    message: 'Loại không hợp lệ',
  })
  type: CouponType;

  @IsNotEmpty({ message: 'Giá trị không được bỏ trống' })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Giá trị phải là số' })
  @IsValidCouponValue('type')
  value: number;

  @IsNotEmpty({
    message: 'Trạng thái không được bỏ trống',
  })
  @IsEnum(CouponStatus, {
    message: 'Trạng thái không hợp lệ',
  })
  status: CouponStatus;
}
