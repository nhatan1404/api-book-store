import { Province } from './province.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Province)
export class ProvinceRepository extends Repository<Province> {}
