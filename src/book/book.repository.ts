import { Book } from './book.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Book)
export class BookRepository extends Repository<Book> {}
