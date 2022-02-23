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
import { UseRoles } from 'nest-access-control';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EntityId } from 'typeorm/repository/EntityId';
import { Public } from '../common/decorators/public.decorator';
import { CreateReviewDTO } from './dto/create-review.dto';
import { UpdateReviewDTO } from './dto/update-review.dto';
import { Review } from './review.entity';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Public()
  @Get('reviews/book/:id')
  getReviews(
    @Param('id', ParseIntPipe) id: EntityId,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Review>> {
    return this.reviewService.findAll(
      { page, limit },
      {
        where: {
          book: { id },
        },
      },
    );
  }

  @UseRoles({
    resource: 'review',
    action: 'read',
    possession: 'any',
  })
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Review>> {
    return this.reviewService.findAll({ page, limit });
  }

  @UseRoles({
    resource: 'review',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: EntityId): Promise<Review> {
    const review = await this.reviewService.findById(id);

    if (!review) {
      throw new NotFoundException(`Ngôn ngữ có mã bằng ${id} không tồn tại`);
    }

    return review;
  }

  @UseRoles({
    resource: 'review',
    action: 'read',
    possession: 'any',
  })
  @Post()
  create(@Body() reviewData: CreateReviewDTO): Promise<Review> {
    return this.reviewService.store(reviewData);
  }

  @UseRoles({
    resource: 'review',
    action: 'update',
    possession: 'any',
  })
  @Put(':id')
  async edit(
    @Param('id', ParseIntPipe) id: EntityId,
    @Body() reviewData: UpdateReviewDTO,
  ): Promise<Review> {
    const review = await this.reviewService.findById(id);

    if (!review) {
      throw new NotFoundException(`Ngôn ngữ có mã bằng ${id} không tồn tại`);
    }

    return this.reviewService.update(id, reviewData);
  }

  @UseRoles({
    resource: 'review',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: EntityId): Promise<void> {
    const { affected } = await this.reviewService.delete(id);

    if (affected === 0) {
      throw new BadRequestException(
        `Xoá ngôn ngữ có mã bằng ${id} không thành công`,
      );
    }
  }
}
