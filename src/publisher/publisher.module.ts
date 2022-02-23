import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';
import { PublisherRepository } from './publisher.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PublisherRepository])],
  controllers: [PublisherController],
  providers: [PublisherService],
})
export class PublisherModule {}
