import { IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CreateRoleDTO {
  @IsNotEmpty({ message: 'Tên vai trò không được bỏ trống' })
  @Length(1, 120, { message: 'Tên phải từ 1 đến 120 kí tự' })
  name: string;

  @IsOptional()
  @Length(1, 255, { message: 'Mô tả phải từ 1 đến 255 kí tự' })
  description: string;
}
