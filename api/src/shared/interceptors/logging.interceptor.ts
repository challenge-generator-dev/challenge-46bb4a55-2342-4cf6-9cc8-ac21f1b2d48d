import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, body, headers } = request;
    const startTime = Date.now();

    const sanitizedHeaders = { ...headers };
    if (sanitizedHeaders.authorization) {
      sanitizedHeaders.authorization = '***';
    }

    this.logger.log(`→ ${method} ${url}`);
    this.logger.debug(`Headers: ${JSON.stringify(sanitizedHeaders)}`);
    
    if (Object.keys(body || {}).length > 0) {
      this.logger.debug(`Body: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `← ${method} ${url} ${response.statusCode} - ${duration}ms`,
          );
          this.logger.debug(`Response: ${JSON.stringify(data)}`);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;
          this.logger.error(
            `← ${method} ${url} ${statusCode} - ${duration}ms - ${error.message}`,
          );
        },
      }),
    );
  }
}