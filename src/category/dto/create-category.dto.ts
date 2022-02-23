import { IsInt, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { IsValidId } from '../../common/validators/is-valid-id.validator';
import { Category } from '../category.entity';

export class CreateCategoryDTO {
  @IsNotEmpty({
    message: 'Tên thể loại không được bỏ trống',
  })
  @Length(3, 120, {
    message: 'Tên thể loại phải chứa từ 3 đến 120 kí tự',
  })
  title: string;

  @IsOptional()
  @Length(1, 255, {
    message: 'Mô tả phải chứa từ 1 đến 255 kí tự',
  })
  description: string;

  @IsOptional()
  @IsInt({
    message: 'Mã thể loại phải là số nguyên',
  })
  @IsValidId(Category, {
    message: 'Mã thể loại không hợp lệ',
  })
  parent: number | null;
}
