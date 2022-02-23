import { District } from './district.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(District)
export class DistrictRepository extends Repository<District> {}
