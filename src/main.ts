import { ValidationConfig } from './config/validation.config';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import * as session from 'express-session';
import { useContainer } from 'typeorm';
//import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe(ValidationConfig));

  useContainer(app.select(AppModule), { fallback: true });
  //app.useLogger(app.get(Logger));

  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

  app.use(
    session({
      secret: configService.get<string>('sessionSecret'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  const port = configService.get<number>('port');
  await app.listen(port);
}
bootstrap();
