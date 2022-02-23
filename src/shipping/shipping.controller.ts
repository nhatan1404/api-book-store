import {
  BadGatewayException,
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
import { UseRoles } from 'nest-access-control';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EntityId } from 'typeorm/repository/EntityId';
import { CreateShippingDTO } from './dto/create-shipping.dto';
import { UpdateShippingDTO } from './dto/update-shipping.dto';
import { Shipping } from './shipping.entity';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @UseRoles({
    resource: 'shipping',
    action: 'read',
    possession: 'any',
  })
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Shipping>> {
    return this.shippingService.findAll({ page, limit });
  }

  @UseRoles({
    resource: 'shipping',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: EntityId): Promise<Shipping> {
    const shipping = await this.shippingService.findById(id);

    if (!shipping) {
      throw new NotFoundException(
        `Thông tin vận chuyển có mã bằng ${id} không tồn tại`,
      );
    }

    return shipping;
  }

  @UseRoles({
    resource: 'shipping',
    action: 'create',
    possession: 'any',
  })
  @Post()
  create(@Body() shippingData: CreateShippingDTO): Promise<Shipping> {
    return this.shippingService.store(shippingData);
  }

  @UseRoles({
    resource: 'shipping',
    action: 'update',
    possession: 'any',
  })
  @Put(':id')
  async edit(
    @Param('id', ParseIntPipe) id: EntityId,
    @Body() shippingData: UpdateShippingDTO,
  ): Promise<Shipping> {
    const shipping = await this.shippingService.findById(id);

    if (!shipping) {
      throw new NotFoundException(
        `Thông tin vận chuyển có mã bằng ${id} không tồn tại`,
      );
    }

    return this.shippingService.update(id, shippingData);
  }

  @UseRoles({
    resource: 'shipping',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: EntityId): Promise<void> {
    const { affected } = await this.shippingService.delete(id);

    if (affected === 0) {
      throw new BadGatewayException(
        `Xoá thông tin vận chuyển có mã bằng ${id} không thành công`,
      );
    }
  }
}
