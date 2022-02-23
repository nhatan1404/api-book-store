import { EntityId } from 'typeorm/repository/EntityId';
import { UserService } from './user.service';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Post,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdateUserDTO } from './dto/update-user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UseRoles } from 'nest-access-control';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseRoles({
    resource: 'user',
    action: 'read',
    possession: 'any',
  })
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<User>> {
    return this.userService.findAll({ page, limit });
  }

  @UseRoles({
    resource: 'user',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: EntityId): Promise<User> {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException(`Tài khoản có mã bằng ${id} không tồn tại`);
    }

    return user;
  }

  @UseRoles({
    resource: 'user',
    action: 'create',
    possession: 'any',
  })
  @Public()
  @Post()
  async create(@Body() userData: CreateUserDTO): Promise<User> {
    const createdUser = await this.userService.store(userData);
    delete createdUser.password;
    return createdUser;
  }

  @UseRoles({
    resource: 'user',
    action: 'update',
    possession: 'any',
  })
  @Put(':id')
  async edit(
    @Param('id', ParseIntPipe) id: EntityId,
    @Body() userData: UpdateUserDTO,
  ): Promise<User> {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException(`Tài khoản có mã bằng ${id} không tồn tại`);
    }

    return this.userService.update(id, userData);
  }

  @UseRoles({
    resource: 'user',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id') id: EntityId): Promise<void> {
    const { affected } = await this.userService.delete(id);

    if (affected > 0) {
    } else {
      throw new NotFoundException(`Tài khoản có mã bằng ${id} không tồn tại`);
    }
  }
}
