import { EntityId } from 'typeorm/repository/EntityId';
import { PublisherService } from './publisher.service';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Body,
  Post,
  Put,
  Delete,
  HttpStatus,
  BadGatewayException,
  HttpCode,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { Publisher } from './publisher.entity';
import { CreatePublisherDTO } from './dto/create-publisher.dto';
import { UpdatePublisherDTO } from './dto/update-publisher.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UseRoles } from 'nest-access-control';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @UseRoles({
    resource: 'publisher',
    action: 'read',
    possession: 'any',
  })
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Publisher>> {
    return this.publisherService.findAll({ page, limit });
  }

  @UseRoles({
    resource: 'publisher',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: EntityId): Promise<Publisher> {
    const publisher = await this.publisherService.findById(id);

    if (!publisher) {
      throw new NotFoundException(
        `Nhà xuất bản có mã bằng ${id} không tồn tại`,
      );
    }

    return publisher;
  }

  @UseRoles({
    resource: 'publisher',
    action: 'create',
    possession: 'any',
  })
  @Post()
  create(@Body() publisherData: CreatePublisherDTO): Promise<Publisher> {
    return this.publisherService.store(publisherData);
  }

  @UseRoles({
    resource: 'publisher',
    action: 'update',
    possession: 'any',
  })
  @Put(':id')
  async edit(
    @Param('id', ParseIntPipe) id: EntityId,
    @Body() publisherData: UpdatePublisherDTO,
  ): Promise<Publisher> {
    const publisher = await this.publisherService.findById(id);

    if (!publisher) {
      throw new NotFoundException(
        `Nhà xuất bản có mã bằng ${id} không tồn tại`,
      );
    }

    return this.publisherService.update(id, publisherData);
  }

  @UseRoles({
    resource: 'publisher',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: EntityId): Promise<void> {
    const { affected } = await this.publisherService.delete(id);

    if (affected === 0) {
      throw new BadGatewayException(
        `Xoá nhà xuất bản có mã bằng ${id} không thành công`,
      );
    }
  }
}
