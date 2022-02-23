import { SlugProvider } from 'src/common/providers/slugify.provider';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Book } from './book.entity';
import { BookService } from './book.service';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
  constructor(
    connection: Connection,
    private readonly bookService: BookService,
    private readonly slugProvider: SlugProvider,
  ) {
    connection.subscribers.push(this);
  }

  listenTo(): typeof Book {
    return Book;
  }

  async beforeInsert(event: InsertEvent<Book>): Promise<void> {
    const { id, title } = event.entity;
    const slug = this.slugProvider.slugify(title);

    const existsBook: Book[] = await this.bookService.findSlugs(slug);

    event.entity.slug = this.slugProvider.uniqueSlug(id, slug, existsBook);
  }
}
