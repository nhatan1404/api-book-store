import { Ward } from './ward.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Ward)
export class WardRepository extends Repository<Ward> {}
