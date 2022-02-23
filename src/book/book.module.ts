import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookRepository } from './book.repository';
import { BookService } from './book.service';
import { SlugProvider } from './../common/providers/slugify.provider';
import { UserSubscriber } from './book.subscriber';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from '../common/utils/multer.util';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookRepository]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        multerOptions({
          fileSize: +configService.get<number>('maxImageSize'),
          uploadPath: configService.get<string>('pathImageBook'),
          ext: configService.get<Array<string>>('allowedExtImg'),
        }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BookController],
  providers: [SlugProvider, UserSubscriber, BookService],
  exports: [BookService],
})
export class BookModule {}
