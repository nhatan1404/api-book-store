import { AccessControlModule, RolesBuilder } from 'nest-access-control';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './common/guards/role.guard';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { CategoryModule } from './category/category.module';
import { LanguageModule } from './language/language.module';
import { AuthorModule } from './author/author.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { LoggerModule } from 'nestjs-pino';
import { PublisherModule } from './publisher/publisher.module';
import { CouponModule } from './coupon/coupon.module';
import { UserModule } from './user/user.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import slugifyConfig from './config/slugify.config';
import authConfig from './config/auth.config';
import hashConfig from './config/hash.config';
import fileConfig from './config/file.config';
import { ReviewModule } from './review/review.module';
import { OrderModule } from './order/order.module';
import { AddressModule } from './address/address.module';
import { ShippingModule } from './shipping/shipping.module';
import { CartModule } from './cart/cart.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { RoleService } from './role/role.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        fileConfig,
        slugifyConfig,
        authConfig,
        hashConfig,
      ],
    }),
    AccessControlModule.forRootAsync({
      imports: [RoleModule],
      inject: [RoleService],
      useFactory: async (roleService: RoleService): Promise<RolesBuilder> => {
        const grants = await roleService.getGrantList();
        return new RolesBuilder(grants);
      },
    }),
    LoggerModule.forRoot(),
    AuthModule,
    UserModule,
    BookModule,
    CategoryModule,
    LanguageModule,
    AuthorModule,
    PublisherModule,
    CouponModule,
    DatabaseModule,
    ReviewModule,
    OrderModule,
    AddressModule,
    ShippingModule,
    CartModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
