import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString({
    message: 'Mật khẩu phải là chuỗi kí tự',
  })
  password: string;
}
