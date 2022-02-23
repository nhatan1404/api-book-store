import { PinoLogger } from 'nestjs-pino';
import { EntityId } from 'typeorm/repository/EntityId';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/base/base.service';
import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';
import { Like, UpdateResult } from 'typeorm';

@Injectable()
export class CategoryService extends BaseService<Category, CategoryRepository> {
  constructor(repository: CategoryRepository, logger: PinoLogger) {
    super(repository, logger);
    this.logger.setContext(CategoryService.name);
  }

  findBySlug(slug: string): Promise<Category> {
    return this.repository.findOne({ slug });
  }

  findAllParentCategories(): Promise<Category[]> {
    return this.repository
      .createQueryBuilder('category')
      .where('category.parent is null')
      .leftJoinAndSelect('category.children', 'children')
      .getMany();
  }

  findChildByParentId(id: EntityId): Promise<Category> {
    return this.repository.findOne({
      where: { id: id },
      relations: ['children'],
    });
  }

  shiftChild(childCategories: EntityId[]): Promise<UpdateResult> {
    return this.repository
      .createQueryBuilder('category')
      .relation(Category, 'parent')
      .of(childCategories)
      .update(null)
      .execute();
  }

  findSlugs(slug: string): Promise<Category[]> {
    return this.repository.find({
      slug: Like(`${slug}%`),
    });
  }
}
