import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Book } from '../../book/book.entity';
import { castStringToNumber } from '../../common/utils/utilities.util';
import { IsValidId } from '../../common/validators/is-valid-id.validator';
import { Compare } from '../../common/validators/is-compare.validator';
import { BookStatus } from '../../book/enum/book-status.enum';

export class CreateCartItemDTO {
  @IsNotEmpty({ message: 'Mã sách không được bỏ trống' })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Mã sách phải là số nguyên' })
  @IsValidId(
    Book,
    { where: { status: BookStatus.ACTIVE } },
    { message: 'Mã sách không hợp lệ' },
  )
  bookId: number;

  @IsNotEmpty({ message: 'Số lượng không được bỏ trống' })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(1, { message: 'Số lượng phải lớn hơn 0' })
  @Compare(
    Book,
    'quantity',
    (quantity: number, stock: number) => quantity < stock,
    {
      message: 'Số lượng không được lớn hơn số lượng tồn kho',
    },
  )
  quantity: number;
}
