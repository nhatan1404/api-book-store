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
import { Permission } from './permission.entity';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { UpdatePermissionDTO } from './dto/update-permission.dto';
import { PermissionService } from './permission.service';
import { UseRoles } from 'nest-access-control';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // @UseRoles({
  //   resource: 'permission',
  //   action: 'read',
  //   possession: 'any',
  // })
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Permission>> {
    return this.permissionService.findAll({ page, limit });
  }

  @UseRoles({
    resource: 'permission',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: EntityId): Promise<Permission> {
    const permission = await this.permissionService.findById(id);

    if (!permission) {
      throw new NotFoundException(`Quyền có mã bằng ${id} không tồn tại`);
    }

    return permission;
  }

  @UseRoles({
    resource: 'permission',
    action: 'create',
    possession: 'any',
  })
  @Post()
  async create(
    @Body() permissionData: CreatePermissionDTO,
  ): Promise<Permission> {
    const permission = await this.permissionService.findByRoleIdAndReource(
      permissionData.role,
      permissionData.resource,
    );
    if (permission) {
      throw new BadRequestException('Quyền đã được tạo');
    }
    return this.permissionService.store(permissionData);
  }

  @UseRoles({
    resource: 'permission',
    action: 'update',
    possession: 'any',
  })
  @Put(':id')
  async edit(
    @Param('id', ParseIntPipe) id: EntityId,
    @Body() permissionData: UpdatePermissionDTO,
  ): Promise<Permission> {
    const permission = await this.permissionService.findById(id);

    if (!permission) {
      throw new NotFoundException(`Quyền có mã bằng ${id} không tồn tại`);
    }

    return this.permissionService.update(id, permissionData);
  }

  @UseRoles({
    resource: 'permission',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: EntityId): Promise<void> {
    const { affected } = await this.permissionService.delete(id);

    if (affected === 0) {
      throw new BadRequestException(
        `Xoá quyền có mã bằng ${id} không thành công`,
      );
    }
  }
}
