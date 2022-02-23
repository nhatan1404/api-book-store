import { IsNotEmpty, Length } from 'class-validator';

export class CreateLanguageDTO {
  @IsNotEmpty({
    message: 'Tên ngôn ngữ không được bỏ trống',
  })
  @Length(1, 30, {
    message: 'Tên ngôn ngữ phải từ 1 đến 120 kí tự',
  })
  name: string;
}
