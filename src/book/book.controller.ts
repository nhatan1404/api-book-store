import { EntityId } from 'typeorm/repository/EntityId';
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Public } from 'src/common/decorators/public.decorator';
import { Book } from './book.entity';
import { CreateBookDTO } from './dto/create-book.dto';
import { UpdateBookDTO } from './dto/update-book.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  checkPathExists,
  getListPath,
  remove,
} from 'src/common/utils/file.util';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UseRoles } from 'nest-access-control';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Public()
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Book>> {
    return this.bookService.findAll({ page, limit });
  }

  @UseRoles({
    resource: 'book',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: EntityId): Promise<Book> {
    const book = await this.bookService.findById(id);

    if (!book) {
      throw new NotFoundException(`Sách có mã bằng "${id}" không tồn tại`);
    }

    return book;
  }

  @Public()
  @Get('/slug/:slug')
  async showBySlug(@Param('slug') slug: string): Promise<Book> {
    const book = await this.bookService.findBySlug(slug);

    if (!book) {
      throw new NotFoundException(
        `Sách có đường dẫn là "${slug}" không tồn tại`,
      );
    }

    return book;
  }

  @UseRoles({
    resource: 'book',
    action: 'create',
    possession: 'any',
  })
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  async create(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Body() bookData: CreateBookDTO,
  ) {
    if ((!bookData.images || bookData.images.length === 0) && !files.images) {
      throw new BadRequestException('Ảnh sách không được bỏ trống');
    }

    let images: string = bookData.images;

    if (files.images) {
      images = getListPath(files.images).toString();
    }
    const data = {
      ...bookData,
      images,
    };
    return this.bookService.store(data);
  }

  @UseRoles({
    resource: 'book',
    action: 'update',
    possession: 'any',
  })
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  async edit(
    @Param('id') id: EntityId,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Body() bookData: UpdateBookDTO,
  ): Promise<Book> {
    if ((!bookData.images || bookData.images.length === 0) && !files.images) {
      throw new BadRequestException('Ảnh sách không được bỏ trống');
    }

    const book = await this.bookService.findById(id);

    if (!book) {
      throw new NotFoundException(`Sách có mã bằng "${id}" không tồn tại`);
    }

    let images: string = bookData.images;
    if (files.images) {
      images = getListPath(files.images).toString();
    }

    const updatedBook = await this.bookService.update(id, {
      ...bookData,
      images: images,
    });

    if (updatedBook) {
      const diffrentImages = book.images.filter(
        (image) => !updatedBook.images.includes(image),
      );
      await this.removeImages(diffrentImages);
    }

    return updatedBook;
  }

  @UseRoles({
    resource: 'book',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id') id: EntityId): Promise<void> {
    const book = await this.bookService.findById(id);
    const { affected } = await this.bookService.delete(id);

    if (affected > 0) {
      await this.removeImages(book.images);
    } else {
      throw new BadRequestException(
        `Xoá sách có mã bằng "${id}" không thành công`,
      );
    }
  }

  private async removeImages(images: string[]) {
    for (const image of images) {
      if (await checkPathExists(image)) {
        await remove(image);
      }
    }
  }
}
