import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { BaseService } from 'src/common/base/base.service';
import { Review } from './review.entity';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService extends BaseService<Review, ReviewRepository> {
  constructor(repository: ReviewRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(ReviewService.name);
  }
}
