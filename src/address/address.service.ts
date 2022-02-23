import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { EntityId } from 'typeorm/repository/EntityId';
import { BaseService } from '../common/base/base.service';
import { Address } from './address.entity';
import { AddressRepository } from './address.repository';

@Injectable()
export class AddressService extends BaseService<Address, AddressRepository> {
  constructor(repository: AddressRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(AddressService.name);
  }

  findByIdAndUserId(addressId: number, userId: number): Promise<Address> {
    return this.repository.findOne({
      relations: ['ward', 'district', 'province', 'user'],
      where: {
        user: { id: userId },
        id: addressId,
      },
    });
  }

  findByUserId(id: EntityId): Promise<Address[]> {
    return this.repository.find({
      relations: ['ward', 'district', 'province', 'user'],
      where: { user: { id } },
    });
  }
}
