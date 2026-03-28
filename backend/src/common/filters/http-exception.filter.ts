import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      message = exceptionResponse.message || exception.message;
    } else if (exception?.code === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      message = 'Not found';
    } else if (exception?.code === 'P2002') {
      status = HttpStatus.CONFLICT;
      message = 'Already exists';
    } else {
      console.error(exception);
    }

    response.status(status).json({
      error: message,
      status,
    });
  }
}
