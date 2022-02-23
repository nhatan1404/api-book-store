import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { BaseService } from '../common/base/base.service';
import { Publisher } from './publisher.entity';
import { PublisherRepository } from './publisher.repository';

@Injectable()
export class PublisherService extends BaseService<
  Publisher,
  PublisherRepository
> {
  constructor(repository: PublisherRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(PublisherService.name);
  }
}
