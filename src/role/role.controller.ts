import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EntityId } from 'typeorm/repository/EntityId';
import { Role } from './role.entity';
import { CreateRoleDTO } from './dto/create-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';
import { RoleService } from './role.service';
import { UseRoles } from 'nest-access-control';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseRoles({
    resource: 'role',
    action: 'read',
    possession: 'any',
  })
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Role>> {
    return this.roleService.findAll({ page, limit });
  }

  @UseRoles({
    resource: 'role',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: EntityId): Promise<Role> {
    const role = await this.roleService.findById(id);

    if (!role) {
      throw new NotFoundException(`Vai trò có mã bằng ${id} không tồn tại`);
    }

    return role;
  }

  @UseRoles({
    resource: 'role',
    action: 'create',
    possession: 'any',
  })
  @Post()
  create(@Body() roleData: CreateRoleDTO): Promise<Role> {
    return this.roleService.store(roleData);
  }

  @UseRoles({
    resource: 'role',
    action: 'update',
    possession: 'any',
  })
  @Put(':id')
  async edit(
    @Param('id', ParseIntPipe) id: EntityId,
    @Body() roleData: UpdateRoleDTO,
  ): Promise<Role> {
    const role = await this.roleService.findById(id);

    if (!role) {
      throw new NotFoundException(`Vai trò có mã bằng ${id} không tồn tại`);
    }

    return this.roleService.update(id, roleData);
  }

  @UseRoles({
    resource: 'role',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: EntityId): Promise<void> {
    const { affected } = await this.roleService.delete(id);

    if (affected === 0) {
      throw new BadRequestException(
        `Xoá vai trò có mã bằng ${id} không thành công`,
      );
    }
  }
}
