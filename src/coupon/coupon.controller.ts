import {
  NotFoundException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  BadRequestException,
  HttpCode,
  DefaultValuePipe,
  Query,
  Session,
} from '@nestjs/common';
import { UseRoles } from 'nest-access-control';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EntityId } from 'typeorm/repository/EntityId';
import { Coupon } from './coupon.entity';
import { CouponService } from './coupon.service';
import { ApplyCouponDTO } from './dto/apply-coupon.dto';
import { CreateCouponDTO } from './dto/create-coupon.dto';
import { UpdateCouponDTO } from './dto/update-coupon.dto';
import { CouponStatus } from './enum/coupon-status.enum';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseRoles({
    resource: 'coupon',
    action: 'create',
    possession: 'any',
  })
  @Post('apply')
  async applyCoupon(@Session() session, @Body() couponCode: ApplyCouponDTO) {
    const coupon = await this.couponService.findByCode(couponCode.code);

    if (!coupon) {
      throw new NotFoundException('Mã giảm giá không tồn tại');
    }

    if (coupon.status === CouponStatus.INACTIVE) {
      throw new BadRequestException('Mã giảm giá đã hết hạn sử dụng');
    }
    session.couponId = coupon.id;
  }

  @UseRoles({
    resource: 'coupon',
    action: 'read',
    possession: 'any',
  })
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Coupon>> {
    return this.couponService.findAll({ page, limit });
  }

  @UseRoles({
    resource: 'coupon',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: EntityId): Promise<Coupon> {
    const coupon = await this.couponService.findById(id);

    if (!coupon) {
      throw new NotFoundException(`Mã giảm giá có mã bằng ${id} không tồn tại`);
    }
    return coupon;
  }

  @UseRoles({
    resource: 'coupon',
    action: 'create',
    possession: 'any',
  })
  @Post()
  create(@Body() couponData: CreateCouponDTO): Promise<Coupon> {
    return this.couponService.store(couponData);
  }

  @UseRoles({
    resource: 'coupon',
    action: 'update',
    possession: 'any',
  })
  @Put(':id')
  async edit(
    @Param('id', ParseIntPipe) id: EntityId,
    @Body() couponData: UpdateCouponDTO,
  ): Promise<Coupon> {
    const coupon = await this.couponService.findById(id);

    if (!coupon) {
      throw new NotFoundException(`Mã giảm giá có mã bằng ${id} không tồn tại`);
    }

    return this.couponService.update(id, couponData);
  }

  @UseRoles({
    resource: 'coupon',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: EntityId): Promise<void> {
    const { affected } = await this.couponService.delete(id);

    if (affected === 0) {
      throw new BadRequestException(
        `Xoá mã giảm giá có mã bằng ${id} không thành công`,
      );
    }
  }
}
