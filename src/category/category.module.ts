import { CategoryRepository } from './category.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { SlugProvider } from 'src/common/providers/slugify.provider';
import { CategoryService } from './category.service';
import { CategorySubscriber } from './category.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryRepository])],
  controllers: [CategoryController],
  providers: [SlugProvider, CategorySubscriber, CategoryService],
})
export class CategoryModule {}
