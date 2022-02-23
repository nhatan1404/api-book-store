import { PinoLogger } from 'nestjs-pino';
import { BaseService } from 'src/common/base/base.service';
import { Injectable } from '@nestjs/common';
import { Author } from './author.entity';
import { AuthorRepository } from './author.repository';

@Injectable()
export class AuthorService extends BaseService<Author, AuthorRepository> {
  constructor(repository: AuthorRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(AuthorService.name);
  }
}
