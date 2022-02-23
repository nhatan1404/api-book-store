import { EntityId } from 'typeorm/repository/EntityId';
import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  ParseIntPipe,
  Delete,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  HttpCode,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpadateCategoryDTO } from './dto/update-category.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Public } from '../common/decorators/public.decorator';
import { UseRoles } from 'nest-access-control';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Category>> {
    return this.categoryService.findAll(
      { page, limit },
      { relations: ['parent'] },
    );
  }

  @UseRoles({
    resource: 'category',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  async showById(@Param('id', ParseIntPipe) id: EntityId): Promise<Category> {
    const category = await this.categoryService.findById(id);

    if (!category) {
      throw new NotFoundException(`Thể loại có mã bằng ${id} không tồn tại`);
    }

    return category;
  }

  @Public()
  @Get('slug/:slug')
  async showBySlug(@Param('slug') slug: string): Promise<Category> {
    const category = await this.categoryService.findBySlug(slug);

    if (!category) {
      throw new NotFoundException(
        `Thể loại có đường dẫn là '${slug}'' không tồn tại`,
      );
    }

    return category;
  }

  @Public()
  @Get('parents')
  async showAllParents(): Promise<Category[]> {
    return this.categoryService.findAllParentCategories();
  }

  @Public()
  @Get('parent/:id')
  async showAllChildOfParent(
    @Param('id', ParseIntPipe) id: EntityId,
  ): Promise<Category[]> {
    const category = await this.categoryService.findChildByParentId(id);

    if (!category) {
      throw new NotFoundException(
        `Thể loại có đường dẫn là '${id}'' không tồn tại`,
      );
    }

    return category.children;
  }

  @UseRoles({
    resource: 'category',
    action: 'create',
    possession: 'any',
  })
  @Post()
  async create(@Body() categoryData: CreateCategoryDTO): Promise<Category> {
    return this.categoryService.store(categoryData);
  }

  @UseRoles({
    resource: 'category',
    action: 'update',
    possession: 'any',
  })
  @Put(':id')
  async edit(
    @Param('id', ParseIntPipe) id: EntityId,
    @Body() categoryData: UpadateCategoryDTO,
  ): Promise<Category> {
    const category = await this.categoryService.findById(id);

    if (!category) {
      throw new NotFoundException(`Thể loại có mã bằng ${id} không tồn tại`);
    }

    if (category.parent) {
      const parent = await this.categoryService.findById(category.parent.id);

      if (!parent) {
        throw new NotFoundException(
          `Thể loại cha có mã bằng ${id} không tồn tại`,
        );
      }
    }

    return this.categoryService.update(id, categoryData);
  }

  @UseRoles({
    resource: 'category',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: EntityId): Promise<void> {
    const { affected } = await this.categoryService.delete(id);

    if (affected === 0) {
      throw new BadRequestException(
        `Xoá tác giả có mã bằng ${id} không thành công`,
      );
    }
  }
}
