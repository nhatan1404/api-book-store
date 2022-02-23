import {
  IsNotEmpty,
  Length,
  IsEnum,
  IsOptional,
  IsDate,
  IsInt,
} from 'class-validator';
import { BookStatus } from '../enum/book-status.enum';
import { Publisher } from '../../publisher/publisher.entity';
import { IsValidId } from '../../common/validators/is-valid-id.validator';
import { Author } from '../../author/author.entity';
import { Language } from '../../language/language.entity';
import { Category } from '../../category/category.entity';
import { castStringToNumber } from '../../common/utils/utilities.util';
import { Transform } from 'class-transformer';

export class CreateBookDTO {
  @IsNotEmpty({ message: 'Tên không được bỏ trống' })
  @Length(2, 255, { message: 'Tên phải từ 2 đến 255 kí tự' })
  title: string;

  @IsNotEmpty({ message: 'Mô tả không được bỏ trống' })
  @Length(50, 350, { message: 'Mô tả phải từ 50 đến 350 kí tự' })
  description: string;

  @IsNotEmpty({ message: 'Số lượng không được bỏ trống' })
  @Transform(({ value }) => castStringToNumber(value))
  quantity: number;

  @IsNotEmpty({ message: 'Số trang không được bỏ trống' })
  @Transform(({ value }) => castStringToNumber(value))
  pageNumber: number;

  @IsOptional()
  // @IsNotEmpty({ message: 'Ảnh không được bỏ trống' })
  // @Length(1, 255, { message: 'Ảnh không hợp lệ' })
  images: string;

  @IsEnum(BookStatus, { message: 'Trạng thái không hợp lệ' })
  status: BookStatus;

  @IsNotEmpty({ message: 'Giá tiền không được bỏ trống' })
  //@IsDecimal({ message: 'Giá tiền không hợp lệ' })
  @Transform(({ value }) => castStringToNumber(value))
  price: number;

  @IsOptional()
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Chiết khấu phải là số nguyên' })
  discount: number;

  @IsOptional()
  @IsDate({ message: 'Ngày xuất bản không hợp lệ' })
  publicationDate: Date;

  @IsOptional()
  @IsDate({ message: 'Ngày tái bản không hợp lệ' })
  reprintDate: Date;

  @IsNotEmpty({ message: 'Mã thể loại không được bỏ trống' })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Mã thể loại phải là số nguyên' })
  @IsValidId(Category, { message: 'Mã thể loại không hợp lệ' })
  category: number;

  @IsNotEmpty({ message: 'Mã tác giả không được bỏ trống' })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Mã tác giả phải là số nguyên' })
  @IsValidId(Author, { message: 'Mã tác giả không hợp lệ' })
  author: number;

  @IsNotEmpty({ message: 'Mã nhà xuất bản không được bỏ trống' })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Mã nhà xuất bản phải là số nguyên' })
  @IsValidId(Publisher, { message: 'Mã nhà xuất bản không hợp lệ' })
  publisher: number;

  @IsNotEmpty({ message: 'Mã ngôn ngữ không được bỏ trống' })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Mã ngôn ngữ phải là số nguyên' })
  @IsValidId(Language, { message: 'Mã ngôn ngữ không hợp lệ' })
  language: number;
}
