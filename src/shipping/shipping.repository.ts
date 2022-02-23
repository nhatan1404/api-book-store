import { Shipping } from './shipping.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Shipping)
export class ShippingRepository extends Repository<Shipping> {}
