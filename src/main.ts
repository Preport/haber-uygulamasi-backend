import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseExceptionFilter } from './lib/exceptionFilters/database-exception.filter';
import { HttpExceptionFilter } from './lib/exceptionFilters/http-exception.filter';
import { ResponseInterceptor } from './response.interceptor';

import helmet from 'helmet';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(helmet());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter(), new DatabaseExceptionFilter());
    await app.listen(3009);
}
bootstrap();

export default class Defaults {
    static origin = 'perport.net';
    static hostname = `https://haber.${this.origin}`;
}
