import { CouponRepository } from './coupon.repository';
import { Injectable } from '@nestjs/common';
import { BaseService } from './../common/base/base.service';
import { Coupon } from './coupon.entity';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class CouponService extends BaseService<Coupon, CouponRepository> {
  constructor(repository: CouponRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(CouponService.name);
  }

  findByCode(code: string): Promise<Coupon> {
    return this.repository.findOne({
      where: { code },
    });
  }
}
