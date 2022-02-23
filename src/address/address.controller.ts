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
import { UseRoles } from 'nest-access-control';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EntityId } from 'typeorm/repository/EntityId';
import { Address } from './address.entity';
import { AddressService } from './address.service';
import { District } from './district.entity';
import { DistrictService } from './district.service';
import { CreateAddressDTO } from './dto/create-address.dto';
import { UpdateAddressDTO } from './dto/update-address.dto';
import { Province } from './province.entity';
import { ProvinceService } from './province.service';
import { Ward } from './ward.entity';
import { WardService } from './ward.service';

@Controller('address')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly provinceService: ProvinceService,
    private readonly districtService: DistrictService,
    private readonly wardService: WardService,
  ) {}

  @Get('province')
  getListProvince(): Promise<Province[]> {
    return this.provinceService.getAll();
  }

  @Get('ditrict/:id')
  getListDistrict(
    @Param('id', ParseIntPipe) provinceId: number,
  ): Promise<District[]> {
    return this.districtService.getListDistrictByProvinceId(provinceId);
  }

  @Get('/ward/:id')
  getListWard(@Param('id', ParseIntPipe) id): Promise<Ward[]> {
    return this.wardService.getListWardByDistictId(id);
  }

  @UseRoles({
    resource: 'address',
    action: 'read',
    possession: 'own',
  })
  @Get('user/:id')
  getListOwnAddress(@Param('id', ParseIntPipe) id: EntityId) {
    return this.addressService.findByUserId(id);
  }

  @UseRoles({
    resource: 'address',
    action: 'read',
    possession: 'any',
  })
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Address>> {
    return this.addressService.findAll(
      {
        page,
        limit,
      },
      {
        relations: ['province', 'district', 'ward'],
      },
    );
  }

  @UseRoles({
    resource: 'address',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: EntityId): Promise<Address> {
    const address = await this.addressService.findById(id);

    if (!address) {
      throw new NotFoundException(`Địa chỉ có mã bằng ${id} không tồn tại`);
    }

    return address;
  }

  @UseRoles({
    resource: 'address',
    action: 'create',
    possession: 'any',
  })
  @Post()
  create(@Body() addressData: CreateAddressDTO): Promise<Address> {
    return this.addressService.store(addressData);
  }

  @UseRoles({
    resource: 'address',
    action: 'update',
    possession: 'any',
  })
  @Put(':id')
  async edit(
    @Param('id', ParseIntPipe) id: EntityId,
    @Body() addressData: UpdateAddressDTO,
  ): Promise<Address> {
    const author = await this.addressService.findById(id);

    if (!author) {
      throw new NotFoundException(`Địa chỉ có mã bằng ${id} không tồn tại`);
    }

    return this.addressService.update(id, addressData);
  }

  @UseRoles({
    resource: 'address',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: EntityId): Promise<void> {
    const { affected } = await this.addressService.delete(id);

    if (affected === 0) {
      throw new BadRequestException(
        `Xoá địa chỉ có mã bằng ${id} không thành công`,
      );
    }
  }
}
