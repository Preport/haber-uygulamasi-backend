import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ThrottlerException } from '@nestjs/throttler';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        console.log(exception);
        if (exception instanceof ThrottlerException) {
            const zaman = response.getHeader('Retry-After');
            exception.message =
                'Yakın zamanda çok fazla istek yolladınız. Lütfen ' + zaman + 'sn sonra tekrar deneyiniz.';
        }
        response.status(status).json({
            success: false,
            statusCode: status,
            message: exception.message,
            details: exception.getResponse(),
        });
    }
}
