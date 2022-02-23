import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { castStringToNumber } from '../../common/utils/utilities.util';
import { IsValidId } from '../../common/validators/is-valid-id.validator';
import { CartItem } from '../cart-items.entity';
import { CreateCartItemDTO } from './create-cart-item.dto';

export class UpdateCartItemDTO extends CreateCartItemDTO {
  @IsNotEmpty({ message: 'Mã item không được bỏ trống' })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Mã item phải là số nguyên' })
  @IsValidId(CartItem, { message: 'Mã item không hợp lệ' })
  itemId: number;
}
