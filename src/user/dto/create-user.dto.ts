import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { IsMatch } from 'src/common/validators/is-match.validator';
import { DefaultValue } from '../../common/decorators/default-value.decorator';
import { castStringToNumber } from '../../common/utils/utilities.util';
import { Role } from '../../role/role.entity';
import { IsUnique } from '../../common/validators/is-unique.validator';
import { IsValidId } from '../../common/validators/is-valid-id.validator';
import { UserStatus } from '../enum/user-status.enum';
import { User } from '../user.entity';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Họ không được bỏ trống' })
  firstname: string;

  @IsNotEmpty({ message: 'Tên không được bỏ trống' })
  lastname: string;

  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
  password: string;

  @IsNotEmpty({
    message: 'Mật khẩu xác nhận không được bỏ trống',
  })
  @IsMatch('password', {
    message: 'Mật khẩu không trùng khớp',
  })
  repassword: string;

  @IsOptional()
  @Length(1, 200, { message: 'Ảnh đại diện phải từ 1 đến 200 kí tự' })
  avatar: string;

  @IsOptional()
  @IsDateString({ message: 'Ngày không hợp lệ' })
  birthday: Date;

  @IsNotEmpty({ message: 'Chưa chọn giới tính' })
  @IsBoolean({ message: 'Giới tính không hợp lệ' })
  gender: boolean;

  @IsNotEmpty({ message: 'Email không được bỏ trống' })
  @IsEmail({ message: 'Email không hợp lệ' })
  @IsUnique(User, { message: 'Email `$value` không có sẵn' })
  email: string;

  @IsOptional()
  @Length(10, 12, { message: 'Số điện thoại phải từ 10 đến 12 kí tự' })
  phone: string;

  @IsOptional()
  @DefaultValue(3)
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Mã vai phải là số' })
  @IsValidId(Role, { message: 'Mã vai trò không hợp lệ' })
  role: number;

  @IsOptional()
  @IsEnum(UserStatus, { message: 'Trạng thái không hợp lệ' })
  status: UserStatus;
}
