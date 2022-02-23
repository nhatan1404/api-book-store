import { Publisher } from './publisher.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Publisher)
export class PublisherRepository extends Repository<Publisher> {}
