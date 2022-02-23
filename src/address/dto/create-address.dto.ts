import { IsNotEmpty, Length } from 'class-validator';
import { IsValidId } from '../../common/validators/is-valid-id.validator';
import { District } from '../district.entity';
import { Province } from '../province.entity';
import { Ward } from '../ward.entity';

export class CreateAddressDTO {
  @IsNotEmpty({
    message: 'Địa chỉ không được bỏ trống',
  })
  @Length(1, 255, {
    message: 'Địa phải chứa từ 1 đến 255 kí tự',
  })
  address: string;

  @IsNotEmpty({ message: 'Tỉnh không được bỏ trống' })
  @IsValidId(Province, { message: 'Mã tỉnh không hợp lệ' })
  province: Province;

  @IsNotEmpty({ message: 'Quận/Thành phố không được bỏ trống' })
  @IsValidId(District, { message: 'Mã quận/thành phố không hợp lệ' })
  district: District;

  @IsNotEmpty({ message: 'Phường/Xã không được bỏ trống' })
  @IsValidId(Ward, { message: 'Mã phường/xã không hợp lệ' })
  ward: Ward;
}
