import { CreateAuthorDTO } from './dto/create-author.dto';
import { UpdateAuthorDTO } from './dto/update-auhtor.dto';
import { EntityId } from 'typeorm/repository/EntityId';
import { AuthorService } from './author.service';
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
} from '@nestjs/common';
import { Author } from './author.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UseRoles } from 'nest-access-control';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @UseRoles({
    resource: 'author',
    action: 'read',
    possession: 'any',
  })
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Author>> {
    return this.authorService.findAll({ page, limit });
  }

  @UseRoles({
    resource: 'author',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: EntityId): Promise<Author> {
    const author = await this.authorService.findById(id);

    if (!author) {
      throw new NotFoundException(`Tác giả có mã bằng ${id} không tồn tại`);
    }

    return author;
  }

  @UseRoles({
    resource: 'author',
    action: 'create',
    possession: 'any',
  })
  @Post()
  create(@Body() authorData: CreateAuthorDTO): Promise<Author> {
    return this.authorService.store(authorData);
  }

  @UseRoles({
    resource: 'author',
    action: 'update',
    possession: 'any',
  })
  @Put(':id')
  async edit(
    @Param('id', ParseIntPipe) id: EntityId,
    @Body() authorData: UpdateAuthorDTO,
  ): Promise<Author> {
    const author = await this.authorService.findById(id);

    if (!author) {
      throw new NotFoundException(`Tác giả có mã bằng ${id} không tồn tại`);
    }

    return this.authorService.update(id, authorData);
  }

  @UseRoles({
    resource: 'author',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: EntityId): Promise<void> {
    const { affected } = await this.authorService.delete(id);

    if (affected === 0) {
      throw new BadRequestException(
        `Xoá tác giả có mã bằng ${id} không thành công`,
      );
    }
  }
}
