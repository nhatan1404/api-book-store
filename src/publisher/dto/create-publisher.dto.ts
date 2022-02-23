import { IsNotEmpty, IsOptional, Length, MaxLength } from 'class-validator';

export class CreatePublisherDTO {
  @IsNotEmpty({
    message: 'Tên nhà xuất bản không được bỏ trống',
  })
  @Length(1, 150, {
    message: 'Tên nhà xuất bản phải từ 1 đến 150 kí tự',
  })
  name: string;

  @IsOptional()
  @MaxLength(255, { message: 'Mô tả không vượt quá 255 kí tự' })
  description: string;
}
