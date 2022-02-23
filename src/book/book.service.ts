import { BaseService } from './../common/base/base.service';
import { Injectable } from '@nestjs/common';
import { Book } from './book.entity';
import { BookRepository } from './book.repository';
import { PinoLogger } from 'nestjs-pino';
import { Like } from 'typeorm';

@Injectable()
export class BookService extends BaseService<Book, BookRepository> {
  constructor(repository: BookRepository, logger: PinoLogger) {
    super(repository, logger);
  }

  findBySlug(slug: string): Promise<Book> {
    return this.repository.findOne({ slug });
  }

  findSlugs(slug: string): Promise<Book[]> {
    return this.repository.find({
      slug: Like(`${slug}%`),
    });
  }
}
