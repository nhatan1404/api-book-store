import { IsNotEmpty } from 'class-validator';

export class ApplyCouponDTO {
  @IsNotEmpty({ message: 'Mã giảm giá không được bỏ trống' })
  code: string;
}
