import { SlugProvider } from 'src/common/providers/slugify.provider';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@EventSubscriber()
export class CategorySubscriber implements EntitySubscriberInterface {
  constructor(
    connection: Connection,
    private readonly categoryService: CategoryService,
    private readonly slugProvider: SlugProvider,
  ) {
    connection.subscribers.push(this);
  }

  listenTo(): typeof Category {
    return Category;
  }

  async beforeInsert(event: InsertEvent<Category>): Promise<void> {
    const { id, title } = event.entity;
    const slug = this.slugProvider.slugify(title);

    const existsCategories: Category[] = await this.categoryService.findSlugs(
      slug,
    );

    event.entity.slug = this.slugProvider.uniqueSlug(
      id,
      slug,
      existsCategories,
    );
  }
}
