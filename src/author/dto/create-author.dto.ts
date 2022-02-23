import { IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CreateAuthorDTO {
  @IsNotEmpty({
    message: 'Tên không được bỏ trống',
  })
  @Length(1, 100, {
    message: 'Tên phải chứa từ 1 đến 100 kí tự',
  })
  firstname: string;

  @IsNotEmpty({
    message: 'Họ không được bỏ trống',
  })
  @Length(1, 100, {
    message: 'Họ phải chứa từ 1 đến 100 kí tự',
  })
  lastname: string;

  @IsOptional()
  biography: string;
}
