import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Book } from '../../book/book.entity';
import { castStringToNumber } from '../../common/utils/utilities.util';
import { IsValidId } from '../../common/validators/is-valid-id.validator';

class BookOrder {
  @IsNotEmpty({
    message: 'Mã sách không được bỏ trống',
  })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Mã sách phải là số nguyên' })
  @IsValidId(Book, { message: 'Mã sách không hợp lệ' })
  id: number;

  @IsNotEmpty({
    message: 'Mã sách không được bỏ trống',
  })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  quantity: number;
}

export class BaseOrder {
  @IsNotEmpty({ message: 'Danh sách sách không được bỏ trống' })
  @ValidateNested({ each: true })
  @Type(() => BookOrder)
  items: BookOrder[];
}
