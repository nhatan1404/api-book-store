import { AddressRepository } from './address.repository';
import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceRepository } from './province.repository';
import { DistrictRepository } from './district.repository';
import { WardRepository } from './ward.repository';
import { DistrictService } from './district.service';
import { WardService } from './ward.service';
import { ProvinceService } from './province.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AddressRepository,
      ProvinceRepository,
      DistrictRepository,
      WardRepository,
    ]),
  ],
  controllers: [AddressController],
  providers: [AddressService, ProvinceService, DistrictService, WardService],
  exports: [AddressService],
})
export class AddressModule {}
