import { Transform } from 'class-transformer';
import { IsNotEmpty, IsEnum, IsInt } from 'class-validator';
import { ResourceValue } from '../../common/shared/enum/resource.enum';
import { castStringToNumber } from '../../common/utils/utilities.util';
import { Role } from '../../role/role.entity';
import { IsValidId } from '../../common/validators/is-valid-id.validator';
import {
  ReadAction,
  CreateAction,
  EditAction,
  DeleteAction,
} from '../enum/permission.enum';

export class CreatePermissionDTO {
  @IsNotEmpty({ message: 'Quyền đọc không được bỏ trống' })
  @IsEnum(ReadAction, { message: 'Giá trị quyền đọc không hợp lệ' })
  canRead: ReadAction;

  @IsNotEmpty({ message: 'Quyền đọc không được bỏ trống' })
  @IsEnum(CreateAction, { message: 'Giá trị quyền đọc không hợp lệ' })
  canCreate: CreateAction;

  @IsNotEmpty({ message: 'Quyền đọc không được bỏ trống' })
  @IsEnum(EditAction, { message: 'Giá trị quyền đọc không hợp lệ' })
  canEdit: EditAction;

  @IsNotEmpty({ message: 'Quyền đọc không được bỏ trống' })
  @IsEnum(DeleteAction, { message: 'Giá trị quyền đọc không hợp lệ' })
  canDelete: DeleteAction;

  @IsNotEmpty({ message: 'Mã vai trò không được bỏ trống' })
  @Transform(({ value }) => castStringToNumber(value))
  @IsInt({ message: 'Mã vai trò phải là số nguyên' })
  @IsValidId(Role, { message: 'Mã vai trò không hợp lệ' })
  role: number;

  @IsNotEmpty({ message: 'Đường dẫn không được bỏ trống' })
  @IsEnum(ResourceValue, { message: 'Đường dẫn không hợp lệ' })
  resource: string;
}
