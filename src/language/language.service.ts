import { PinoLogger } from 'nestjs-pino';
import { LanguageRepository } from './language.repository';
import { Language } from './language.entity';
import { BaseService } from 'src/common/base/base.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LanguageService extends BaseService<Language, LanguageRepository> {
  constructor(repository: LanguageRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(LanguageService.name);
  }
}
