import { Coupon } from './coupon.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Coupon)
export class CouponRepository extends Repository<Coupon> {}
