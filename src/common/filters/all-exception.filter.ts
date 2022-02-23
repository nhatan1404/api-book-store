import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { Logger } from '@nestjs/common';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: HttpException | Error, host: ArgumentsHost): void {
    const context: HttpArgumentsHost = host.switchToHttp();
    const response = context.getResponse<Response>();
    this.handleMessage(exception);
    AllExceptionFilter.handleResponse(response, exception);
  }

  private static handleResponse(
    response: Response,
    exception: HttpException | QueryFailedError | Error,
  ): void {
    let responseBody: any = { message: 'Internal server error' };
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      responseBody = exception.getResponse();
      statusCode = exception.getStatus();
    } else if (exception instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      responseBody = {
        statusCode: statusCode,
        message: exception.message,
      };
    } else if (exception instanceof TypeORMError) {
      responseBody = {
        statusCode: statusCode,
        message: exception.message,
      };
    } else if (exception instanceof TypeError) {
      responseBody = {
        statusCode: statusCode,
        message: exception.message,
      };
    } else {
      responseBody = {
        statusCode: statusCode,
        message: exception.stack,
      };
    }

    response.status(statusCode).json(responseBody);
  }

  private handleMessage(
    exception: HttpException | QueryFailedError | Error | any,
  ): void {
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      message = JSON.stringify(exception.getResponse());
    } else if (exception instanceof QueryFailedError) {
      message = exception.stack.toString();
    } else {
      message = exception.stack.toString();
    }
    this.logger.log(message);
  }
}
